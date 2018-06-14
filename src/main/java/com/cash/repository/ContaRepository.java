package com.cash.repository;

import com.cash.domain.Conta;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Conta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {

    Page<Conta> findAllByDataAfter(Pageable pageable, java.time.LocalDate date);
}
