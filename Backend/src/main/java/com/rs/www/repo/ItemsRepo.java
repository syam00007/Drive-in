package com.rs.www.repo;

import com.rs.www.model.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemsRepo extends JpaRepository<Items, Long> {
    List<Items> findByCounterId(Long counterId);

    List<Items> findByCategoryId(Long id);
}