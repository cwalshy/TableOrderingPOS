import { Time } from "@angular/common";
import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface Orders {
    id: string;
    name: string;
    cost: number;
    tableNumber: string;
    quantity: string;
    orderCompleted: string,
    timestamp: Date
}