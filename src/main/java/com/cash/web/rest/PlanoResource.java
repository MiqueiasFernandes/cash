package com.cash.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cash.domain.Plano;

import com.cash.repository.PlanoRepository;
import com.cash.web.rest.errors.BadRequestAlertException;
import com.cash.web.rest.util.HeaderUtil;
import com.cash.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Plano.
 */
@RestController
@RequestMapping("/api")
public class PlanoResource {

    private final Logger log = LoggerFactory.getLogger(PlanoResource.class);

    private static final String ENTITY_NAME = "plano";

    private final PlanoRepository planoRepository;

    public PlanoResource(PlanoRepository planoRepository) {
        this.planoRepository = planoRepository;
    }

    /**
     * POST  /planos : Create a new plano.
     *
     * @param plano the plano to create
     * @return the ResponseEntity with status 201 (Created) and with body the new plano, or with status 400 (Bad Request) if the plano has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/planos")
    @Timed
    public ResponseEntity<Plano> createPlano(@RequestBody Plano plano) throws URISyntaxException {
        log.debug("REST request to save Plano : {}", plano);
        if (plano.getId() != null) {
            throw new BadRequestAlertException("A new plano cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plano result = planoRepository.save(plano);
        return ResponseEntity.created(new URI("/api/planos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /planos : Updates an existing plano.
     *
     * @param plano the plano to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated plano,
     * or with status 400 (Bad Request) if the plano is not valid,
     * or with status 500 (Internal Server Error) if the plano couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/planos")
    @Timed
    public ResponseEntity<Plano> updatePlano(@RequestBody Plano plano) throws URISyntaxException {
        log.debug("REST request to update Plano : {}", plano);
        if (plano.getId() == null) {
            return createPlano(plano);
        }
        Plano result = planoRepository.save(plano);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, plano.getId().toString()))
            .body(result);
    }

    /**
     * GET  /planos : get all the planos.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of planos in body
     */
    @GetMapping("/planos")
    @Timed
    public ResponseEntity<List<Plano>> getAllPlanos(Pageable pageable) {
        log.debug("REST request to get a page of Planos");
        Page<Plano> page = planoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/planos");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /planos/:id : get the "id" plano.
     *
     * @param id the id of the plano to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the plano, or with status 404 (Not Found)
     */
    @GetMapping("/planos/{id}")
    @Timed
    public ResponseEntity<Plano> getPlano(@PathVariable Long id) {
        log.debug("REST request to get Plano : {}", id);
        Plano plano = planoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(plano));
    }

    /**
     * DELETE  /planos/:id : delete the "id" plano.
     *
     * @param id the id of the plano to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/planos/{id}")
    @Timed
    public ResponseEntity<Void> deletePlano(@PathVariable Long id) {
        log.debug("REST request to delete Plano : {}", id);
        planoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
