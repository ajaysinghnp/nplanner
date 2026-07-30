import type { Id, IsoDateString } from "@/types/common";

export const CALENDAR_TYPES = ["AD", "BS"] as const;

export type CalendarType = (typeof CALENDAR_TYPES)[number];

export type GregorianDate = {
  year: number;
  month: number;
  day: number;
};

export type NepaliDate = {
  year: number;
  month: number;
  day: number;
};

export type CalendarDate = {
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
};

export type NepaliCalendarDataset = {
  id: Id;
  code: string;
  name: string;
  startYear: number;
  endYear: number;
  referenceGregorianDate: IsoDateString;
  referenceNepaliDate: NepaliDate;
  isActive: boolean;
};
