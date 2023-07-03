//export const dateSort = (dateA: Date | null, dateB: Date | null): number => {
//    if (dateA != null && dateB != null) {
//        return compareAsc(dateA, dateB);
//    }
//    if (dateA == null && dateB != null) {
//        return -1;
//    }
//    if (dateA != null && dateB == null) {
//        return 1;
//    }
//    return 0;
//}


export const defaultSort = (a: any, b: any): number => {
    if (a != null && b != null) {
        if (a < b) return -1;
        if (b < a) return 1;
        return 0;
    }
    if (a == null && b != null) {
        return -1;
    }
    if (a != null && b == null) {
        return 1;
    }
    return 0;
};
