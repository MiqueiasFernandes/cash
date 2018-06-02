package com.cash.web.rest;

import com.cash.CashApp;

import com.cash.domain.Conta;
import com.cash.repository.ContaRepository;
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

import com.cash.domain.enumeration.Destino;
import com.cash.domain.enumeration.Area;
import com.cash.domain.enumeration.Recurso;
/**
 * Test class for the ContaResource REST controller.
 *
 * @see ContaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CashApp.class)
public class ContaResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final Float DEFAULT_VALOR = 1F;
    private static final Float UPDATED_VALOR = 2F;

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_PARCELAS = 1;
    private static final Integer UPDATED_PARCELAS = 2;

    private static final Boolean DEFAULT_ISENTRADA = false;
    private static final Boolean UPDATED_ISENTRADA = true;

    private static final Boolean DEFAULT_ATIVO = false;
    private static final Boolean UPDATED_ATIVO = true;

    private static final Destino DEFAULT_DESTINO = Destino.MIQUEIAS;
    private static final Destino UPDATED_DESTINO = Destino.ALDA;

    private static final Area DEFAULT_AREA = Area.ALIMENTAR;
    private static final Area UPDATED_AREA = Area.ROUPA;

    private static final Recurso DEFAULT_RECURSO = Recurso.BB_CREDITO;
    private static final Recurso UPDATED_RECURSO = Recurso.BB_DEBITO;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restContaMockMvc;

    private Conta conta;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ContaResource contaResource = new ContaResource(contaRepository);
        this.restContaMockMvc = MockMvcBuilders.standaloneSetup(contaResource)
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
    public static Conta createEntity(EntityManager em) {
        Conta conta = new Conta()
            .nome(DEFAULT_NOME)
            .valor(DEFAULT_VALOR)
            .data(DEFAULT_DATA)
            .parcelas(DEFAULT_PARCELAS)
            .isentrada(DEFAULT_ISENTRADA)
            .ativo(DEFAULT_ATIVO)
            .destino(DEFAULT_DESTINO)
            .area(DEFAULT_AREA)
            .recurso(DEFAULT_RECURSO);
        return conta;
    }

    @Before
    public void initTest() {
        conta = createEntity(em);
    }

    @Test
    @Transactional
    public void createConta() throws Exception {
        int databaseSizeBeforeCreate = contaRepository.findAll().size();

        // Create the Conta
        restContaMockMvc.perform(post("/api/contas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isCreated());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeCreate + 1);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testConta.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testConta.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testConta.getParcelas()).isEqualTo(DEFAULT_PARCELAS);
        assertThat(testConta.isIsentrada()).isEqualTo(DEFAULT_ISENTRADA);
        assertThat(testConta.isAtivo()).isEqualTo(DEFAULT_ATIVO);
        assertThat(testConta.getDestino()).isEqualTo(DEFAULT_DESTINO);
        assertThat(testConta.getArea()).isEqualTo(DEFAULT_AREA);
        assertThat(testConta.getRecurso()).isEqualTo(DEFAULT_RECURSO);
    }

    @Test
    @Transactional
    public void createContaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = contaRepository.findAll().size();

        // Create the Conta with an existing ID
        conta.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContaMockMvc.perform(post("/api/contas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isBadRequest());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllContas() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        // Get all the contaList
        restContaMockMvc.perform(get("/api/contas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(conta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].parcelas").value(hasItem(DEFAULT_PARCELAS)))
            .andExpect(jsonPath("$.[*].isentrada").value(hasItem(DEFAULT_ISENTRADA.booleanValue())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].destino").value(hasItem(DEFAULT_DESTINO.toString())))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA.toString())))
            .andExpect(jsonPath("$.[*].recurso").value(hasItem(DEFAULT_RECURSO.toString())));
    }

    @Test
    @Transactional
    public void getConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);

        // Get the conta
        restContaMockMvc.perform(get("/api/contas/{id}", conta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(conta.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.parcelas").value(DEFAULT_PARCELAS))
            .andExpect(jsonPath("$.isentrada").value(DEFAULT_ISENTRADA.booleanValue()))
            .andExpect(jsonPath("$.ativo").value(DEFAULT_ATIVO.booleanValue()))
            .andExpect(jsonPath("$.destino").value(DEFAULT_DESTINO.toString()))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA.toString()))
            .andExpect(jsonPath("$.recurso").value(DEFAULT_RECURSO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingConta() throws Exception {
        // Get the conta
        restContaMockMvc.perform(get("/api/contas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();

        // Update the conta
        Conta updatedConta = contaRepository.findOne(conta.getId());
        // Disconnect from session so that the updates on updatedConta are not directly saved in db
        em.detach(updatedConta);
        updatedConta
            .nome(UPDATED_NOME)
            .valor(UPDATED_VALOR)
            .data(UPDATED_DATA)
            .parcelas(UPDATED_PARCELAS)
            .isentrada(UPDATED_ISENTRADA)
            .ativo(UPDATED_ATIVO)
            .destino(UPDATED_DESTINO)
            .area(UPDATED_AREA)
            .recurso(UPDATED_RECURSO);

        restContaMockMvc.perform(put("/api/contas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedConta)))
            .andExpect(status().isOk());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate);
        Conta testConta = contaList.get(contaList.size() - 1);
        assertThat(testConta.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConta.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testConta.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testConta.getParcelas()).isEqualTo(UPDATED_PARCELAS);
        assertThat(testConta.isIsentrada()).isEqualTo(UPDATED_ISENTRADA);
        assertThat(testConta.isAtivo()).isEqualTo(UPDATED_ATIVO);
        assertThat(testConta.getDestino()).isEqualTo(UPDATED_DESTINO);
        assertThat(testConta.getArea()).isEqualTo(UPDATED_AREA);
        assertThat(testConta.getRecurso()).isEqualTo(UPDATED_RECURSO);
    }

    @Test
    @Transactional
    public void updateNonExistingConta() throws Exception {
        int databaseSizeBeforeUpdate = contaRepository.findAll().size();

        // Create the Conta

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restContaMockMvc.perform(put("/api/contas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(conta)))
            .andExpect(status().isCreated());

        // Validate the Conta in the database
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteConta() throws Exception {
        // Initialize the database
        contaRepository.saveAndFlush(conta);
        int databaseSizeBeforeDelete = contaRepository.findAll().size();

        // Get the conta
        restContaMockMvc.perform(delete("/api/contas/{id}", conta.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Conta> contaList = contaRepository.findAll();
        assertThat(contaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Conta.class);
        Conta conta1 = new Conta();
        conta1.setId(1L);
        Conta conta2 = new Conta();
        conta2.setId(conta1.getId());
        assertThat(conta1).isEqualTo(conta2);
        conta2.setId(2L);
        assertThat(conta1).isNotEqualTo(conta2);
        conta1.setId(null);
        assertThat(conta1).isNotEqualTo(conta2);
    }
}
