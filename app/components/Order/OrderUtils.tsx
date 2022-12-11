import { MaterialIconType } from "../../constants/MaterialIconType"

export const getOrderStatusMsg = (status: number) => {
    switch (status) {
        case OrderStatus.SUBMITTED:
            return 'Order Is Waiting For Shop Confirmation'
        case OrderStatus.READY_TO_BE_SHIPPED:
            return 'Order Is Ready To Ship'
        case OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP:
            return 'Order Is Waiting For Shipper To Pick Up'
        case OrderStatus.PROGRESSING:
            return 'Order Is The Way'
        case OrderStatus.DONE:
            return 'Order Was Delivered'
        case OrderStatus.CANCELED:
            return 'Order Was Cancelled'
        default:
            return 'Not Supported Type'
    }
}

export const getOrderStatusIcon = (status: number): MaterialIconType => {
    switch (status) {
        case OrderStatus.SUBMITTED:
            return 'av-timer'
        case OrderStatus.READY_TO_BE_SHIPPED:
            return 'playlist-add-check'
        case OrderStatus.WAITING_FOR_SHIPPER_TO_PICK_UP:
            return 'wheelchair-pickup'
        case OrderStatus.PROGRESSING:
            return 'local-shipping'
        case OrderStatus.DONE:
            return 'done-all'
        case OrderStatus.CANCELED:
            return 'cancel-presentation'
        default:
            return 'no-encryption'
    }
}


// STATUS
// 1 -> 2 -> 6 -> 3 -> 4
//      2 <-        -> 5
export enum OrderStatus {
    SUBMITTED = 1,
    READY_TO_BE_SHIPPED = 2,
    PROGRESSING = 3,
    DONE = 4,
    CANCELED = 5,
    WAITING_FOR_SHIPPER_TO_PICK_UP = 6
}
