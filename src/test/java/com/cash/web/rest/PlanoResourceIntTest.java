package com.cash.web.rest;

import com.cash.CashApp;

import com.cash.domain.Plano;
import com.cash.repository.PlanoRepository;
import com.cash.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.cash.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PlanoResource REST controller.
 *
 * @see PlanoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CashApp.class)
public class PlanoResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_ATIVO = false;
    private static final Boolean UPDATED_ATIVO = true;

    private static final String DEFAULT_DETALHES = "AAAAAAAAAA";
    private static final String UPDATED_DETALHES = "BBBBBBBBBB";

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPlanoMockMvc;

    private Plano plano;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PlanoResource planoResource = new PlanoResource(planoRepository);
        this.restPlanoMockMvc = MockMvcBuilders.standaloneSetup(planoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plano createEntity(EntityManager em) {
        Plano plano = new Plano()
            .nome(DEFAULT_NOME)
            .data(DEFAULT_DATA)
            .ativo(DEFAULT_ATIVO)
            .detalhes(DEFAULT_DETALHES);
        return plano;
    }

    @Before
    public void initTest() {
        plano = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlano() throws Exception {
        int databaseSizeBeforeCreate = planoRepository.findAll().size();

        // Create the Plano
        restPlanoMockMvc.perform(post("/api/planos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(plano)))
            .andExpect(status().isCreated());

        // Validate the Plano in the database
        List<Plano> planoList = planoRepository.findAll();
        assertThat(planoList).hasSize(databaseSizeBeforeCreate + 1);
        Plano testPlano = planoList.get(planoList.size() - 1);
        assertThat(testPlano.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testPlano.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testPlano.isAtivo()).isEqualTo(DEFAULT_ATIVO);
        assertThat(testPlano.getDetalhes()).isEqualTo(DEFAULT_DETALHES);
    }

    @Test
    @Transactional
    public void createPlanoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = planoRepository.findAll().size();

        // Create the Plano with an existing ID
        plano.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlanoMockMvc.perform(post("/api/planos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(plano)))
            .andExpect(status().isBadRequest());

        // Validate the Plano in the database
        List<Plano> planoList = planoRepository.findAll();
        assertThat(planoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllPlanos() throws Exception {
        // Initialize the database
        planoRepository.saveAndFlush(plano);

        // Get all the planoList
        restPlanoMockMvc.perform(get("/api/planos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plano.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].detalhes").value(hasItem(DEFAULT_DETALHES.toString())));
    }

    @Test
    @Transactional
    public void getPlano() throws Exception {
        // Initialize the database
        planoRepository.saveAndFlush(plano);

        // Get the plano
        restPlanoMockMvc.perform(get("/api/planos/{id}", plano.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(plano.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.ativo").value(DEFAULT_ATIVO.booleanValue()))
            .andExpect(jsonPath("$.detalhes").value(DEFAULT_DETALHES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPlano() throws Exception {
        // Get the plano
        restPlanoMockMvc.perform(get("/api/planos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlano() throws Exception {
        // Initialize the database
        planoRepository.saveAndFlush(plano);
        int databaseSizeBeforeUpdate = planoRepository.findAll().size();

        // Update the plano
        Plano updatedPlano = planoRepository.findOne(plano.getId());
        // Disconnect from session so that the updates on updatedPlano are not directly saved in db
        em.detach(updatedPlano);
        updatedPlano
            .nome(UPDATED_NOME)
            .data(UPDATED_DATA)
            .ativo(UPDATED_ATIVO)
            .detalhes(UPDATED_DETALHES);

        restPlanoMockMvc.perform(put("/api/planos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlano)))
            .andExpect(status().isOk());

        // Validate the Plano in the database
        List<Plano> planoList = planoRepository.findAll();
        assertThat(planoList).hasSize(databaseSizeBeforeUpdate);
        Plano testPlano = planoList.get(planoList.size() - 1);
        assertThat(testPlano.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPlano.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testPlano.isAtivo()).isEqualTo(UPDATED_ATIVO);
        assertThat(testPlano.getDetalhes()).isEqualTo(UPDATED_DETALHES);
    }

    @Test
    @Transactional
    public void updateNonExistingPlano() throws Exception {
        int databaseSizeBeforeUpdate = planoRepository.findAll().size();

        // Create the Plano

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPlanoMockMvc.perform(put("/api/planos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(plano)))
            .andExpect(status().isCreated());

        // Validate the Plano in the database
        List<Plano> planoList = planoRepository.findAll();
        assertThat(planoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePlano() throws Exception {
        // Initialize the database
        planoRepository.saveAndFlush(plano);
        int databaseSizeBeforeDelete = planoRepository.findAll().size();

        // Get the plano
        restPlanoMockMvc.perform(delete("/api/planos/{id}", plano.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Plano> planoList = planoRepository.findAll();
        assertThat(planoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plano.class);
        Plano plano1 = new Plano();
        plano1.setId(1L);
        Plano plano2 = new Plano();
        plano2.setId(plano1.getId());
        assertThat(plano1).isEqualTo(plano2);
        plano2.setId(2L);
        assertThat(plano1).isNotEqualTo(plano2);
        plano1.setId(null);
        assertThat(plano1).isNotEqualTo(plano2);
    }
}
