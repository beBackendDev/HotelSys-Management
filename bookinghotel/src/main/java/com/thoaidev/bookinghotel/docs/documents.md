# **JAVA SPRING**
## **Specification** 

Trước tiên để biết về Specification trongg Spring thì ta cần biết thêm về JPA( stand for `Java Persistence API`) là một tiêu chuẩn kĩ thuật chính thức của Java về việc lưu trữ và thao tác dữ liệu trong CSDL quan hệ một cách đơn giản và hiệu quả. Trong JPQ, `Specification` là một API mạnh mẽ giúp xây dựng các truy vấn cơ sở dữ liệu một cách linh hoạt và hiệu quả.

**Tài liệu tham khảo:** [Specifications trong Java Spring Boot](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html).

**Specifications trong Java Spring**: là một `interface` trong `Spring Data JPA` định nghĩa một tập hợp các tiêu chí truy vấn, có thể tái sử dụng và kết hợp với nhau. Một `Specification` được xây dựng dựa trên `API Criteria` của JPA, cho phép chúng ta xác định các tiêu chí truy vấn cụ thể dưới dạng các đối tượng Java.

**Lợi ích:** 
* **Tái sử dụng:**  Các Specification có thể được tái sử dụng và kết hợp với nhau để tạo ra các truy vấn phức tạp.
* **Linh hoạt:** Cho phép xây dựng các truy vấn linh động mà không cần viết lại mã nguồn.
* **Rõ ràng và dễ đọc:** Các truy vấn được xây dựng dễ hiểu hơn, giúp cải thiện khả năng bảo trì và debug.

**Defined Specification:**
```
public interface Specification<T> {
  Predicate toPredicate(Root<T> root, CriteriaQuery<?> query,
            CriteriaBuilder builder);
}
```

`Specification` có thể được sử dụng dễ dàng để xây dựng mội tập hợp các vị từ( `predicates`) ở phía trên một thực thể( `entity`) nó có thể được kết hợp và sử dụng với `JpaRepository` mà không cần phải khai báo câu query 

## **location trong react-router-dom**