// Imports
import { Module } from "@nestjs/common";
import { StrService } from "./str.service";

@Module({providers: [StrService]})
export class UtilsModule {}