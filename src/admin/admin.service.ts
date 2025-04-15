// Imports
import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/db/mongo';
import { HTTPError, raiseNotFound } from 'src/configs/error';
import { MailJetService } from 'src/thirdParty/mailjet/mail.jet.service';
import { DOC_APPEROVE, DOC_DECLINE } from 'src/constants/strings';

@Injectable()
export class AdminService {
  constructor(
    private readonly mongo: MongoService,
    private readonly mailJet: MailJetService,
  ) {}

  async users() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: { $nin: [2] },
      },
      [
        'isActive',
        'name',
        'email',
        'isAadhaarApproved',
        'isDriverLicenceApproved',
      ],
    );

    return { list: users };
  }

  async drivers() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: '1',
      },
      ['name', 'email', 'isDriverLicenceApproved'],
    );

    return { list: users };
  }

  async riders() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: '0',
      },
      ['name', 'email', 'isAadhaarApproved'],
    );

    return { list: users };
  }

  async updateUserStatus(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const isActive = reqData.isActive;

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    await this.mongo.updateOne('User', { _id: existingData._id }, { isActive });

    return {
      success: true,
      successMsg: `${existingData.name} is ${isActive ? 'activated' : 'deactivated'} Successfully !`,
    };
  }

  async pendingApprovals() {
    const user_list = await this.mongo.findAll(
      'User',
      {
        fileDocId: { $ne: null },
        isAadhaarApproved: false,
        isDriverLicenceApproved: false,
      },
      ['name', 'type', 'fileDocId'],
    );

    const fileDocIds = user_list.map((el) => el.fileDocId);
    const file_list = await this.mongo.findAll('FileDoc', {
      _id: { $in: fileDocIds },
    });

    const target_list: any = [];
    user_list.forEach((el) => {
      const fileData = file_list.find((subEl) => subEl._id == el.fileDocId);
      target_list.push({
        name: el.name,
        type: el.type,
        _id: el._id,
        base64Content: fileData.content,
      });
    });

    return { list: target_list };
  }

  async updateDocStatus(reqData) {
    const action = reqData.action;
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    await this.mailJet.sendMail({
      subject: `Document is ${action == 'approve' ? 'Approved' : 'Declined'}`,
      email: existingData.email,
      htmlContent: (action == 'approve' ? DOC_APPEROVE : DOC_DECLINE).replace(
        'USER_NAME',
        existingData.name,
      ),
    });

    const updatedData: any = {};
    if (action == 'approve') {
      if (existingData.type == '0') {
        updatedData.isAadhaarApproved = true;
      } else {
        updatedData.isDriverLicenceApproved = true;
      }

      await this.mongo.insert('Notification', {
        dateTime: new Date(),
        userId: existingData._id,
        content: `Your document has been verified !`,
      });
    } else {
      updatedData.fileDocId = null;

      await this.mongo.insert('Notification', {
        dateTime: new Date(),
        userId: existingData._id,
        content: `Your document has been rejected !`,
      });
    }

    await this.mongo.updateOne('User', { _id: existingData._id }, updatedData);

    return {
      success: true,
      successMsg: `Document is ${action == 'approve' ? 'Approved' : 'Declined'}`,
    };
  }

  async totalRides() {
    const list = await this.mongo.findAll('Ride', {}, [
      'startPlace',
      'endPlace',
      'rideTime',
      'status',
      'total_payment',
    ]);

    list.sort((b, a) => a.rideTime.getTime() - b.rideTime.getTime());

    return { list };
  }

  async monthlyUsers() {
    // Calculate date range - current month and previous 5 months
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from the first day of the month
    sixMonthsAgo.setHours(0, 0, 0, 0); // Set to start of day

    // Generate all months in the range for zero-filling
    const monthsInRange: any[] = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(sixMonthsAgo.getMonth() + i);
      monthsInRange.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1, // Months are 0-indexed in JS
        monthName: date.toLocaleString('default', { month: 'short' }), // e.g., "Jan"
      });
    }

    // Get actual data from DB using the aggregate function
    const actualData = await this.mongo.aggregate('User', [
      {
        $match: {
          $expr: {
            $gte: [
              { $toDate: '$_id' }, // Convert ObjectId to Date
              sixMonthsAgo,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: '$_id' } },
            month: { $month: { $toDate: '$_id' } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    // Merge with all months, filling zeros where needed
    const result = monthsInRange.map((month) => {
      const found = actualData.find(
        (d) => d.year === month.year && d.month === month.month,
      );
      return {
        ...month,
        count: found?.count || 0,
      };
    });
    return { list: result };
  }

  async yearlyUsers() {
    // Current date and calculate ranges
    const currentDate = new Date();

    // Current year range (Jan 1 to now)
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);

    // Last year equivalent range (same date range as current year)
    const lastYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
    );

    // Get current year total count
    const currentYearCount = await this.mongo.count('Ride', {
      $expr: {
        $gte: [{ $toDate: '$_id' }, currentYearStart],
      },
    });

    // Get last year total count for same period
    const lastYearCount = await this.mongo.count('Ride', {
      $expr: {
        $and: [
          { $gte: [{ $toDate: '$_id' }, lastYearStart] },
          { $lte: [{ $toDate: '$_id' }, lastYearEnd] },
        ],
      },
    });

    // Calculate growth percentage
    let growthPercentage = 0;
    if (lastYearCount > 0) {
      growthPercentage =
        ((currentYearCount - lastYearCount) / lastYearCount) * 100;
    } else if (currentYearCount > 0) {
      growthPercentage = 100; // infinite growth (from 0 to positive)
    }

    return {
      summary: {
        totalCurrentYear: currentYearCount,
        totalLastYear: lastYearCount,
        totalGrowth: parseFloat(growthPercentage.toFixed(2)),
        totalTrend: growthPercentage >= 0 ? 'positive' : 'negative',
        growthPercentage: `${parseFloat(growthPercentage.toFixed(2))}%`, // Added percentage string
      },
    };
  }

  async monthlyComparison() {
    const currentDate = new Date();

    // Current month range (1st to now)
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    // Previous month equivalent range (same day range)
    const prevMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const prevMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
    );

    // Get current month count
    const currentMonthCount = await this.mongo.count('Ride', {
      $expr: {
        $gte: [{ $toDate: '$_id' }, currentMonthStart],
      },
    });

    // Get previous month count for same period
    const prevMonthCount = await this.mongo.count('Ride', {
      $expr: {
        $and: [
          { $gte: [{ $toDate: '$_id' }, prevMonthStart] },
          { $lte: [{ $toDate: '$_id' }, prevMonthEnd] },
        ],
      },
    });

    // Calculate growth percentage
    let growthPercentage = 0;
    if (prevMonthCount > 0) {
      growthPercentage =
        ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
    } else if (currentMonthCount > 0) {
      growthPercentage = 100; // infinite growth (from 0 to positive)
    }

    return {
      summary: {
        currentMonth: currentMonthCount,
        previousMonth: prevMonthCount,
        growth: parseFloat(growthPercentage.toFixed(2)),
        trend: growthPercentage >= 0 ? 'positive' : 'negative',
        growthPercentage: `${parseFloat(growthPercentage.toFixed(2))}%`,
        currentMonthName: currentMonthStart.toLocaleString('default', {
          month: 'long',
        }),
        previousMonthName: prevMonthStart.toLocaleString('default', {
          month: 'long',
        }),
      },
    };
  }

  async userInsights() {
    const users = await this.mongo.findAll('User', {}, ['type']);
    const rides = await this.mongo.findAll('Ride', {}, ['status']);

    const count = { total: 0, driver: 0, rider: 0, rides: rides.length };

    users.forEach((el) => {
      count.total++;

      if (el.type == '0') {
        count.rider++;
      } else if (el.type == '1') {
        count.driver++;
      }
    });

    return { count };
  }
}
