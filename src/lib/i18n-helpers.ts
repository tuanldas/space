/**
 * Chuyển đổi cấu trúc messages từ dạng nested object sang dạng phẳng
 * Ví dụ: { user: { management: { title: "Quản lý" } } }
 * Thành: { "user.management.title": "Quản lý" }
 *
 * @param nestedMessages - Đối tượng chứa các messages có cấu trúc phân cấp
 * @param prefix - Tiền tố cho key (được sử dụng trong quá trình đệ quy)
 * @returns Đối tượng phẳng với các key theo định dạng "parent.child.grandchild"
 */
export function flattenMessages(nestedMessages: Record<string, any>, prefix = ''): Record<string, string> {
    // Xử lý trường hợp object null
    if (nestedMessages === null) {
        return {};
    }

    // Duyệt qua các key trong object và biến đổi thành cấu trúc phẳng
    return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        // Nếu giá trị là string, thêm vào messages với key đã được ghép tiền tố
        if (typeof value === 'string') {
            Object.assign(messages, { [prefixedKey]: value });
        }
        // Nếu giá trị là object, gọi đệ quy để phẳng hóa object con
        else {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        }

        return messages;
    }, {});
}
