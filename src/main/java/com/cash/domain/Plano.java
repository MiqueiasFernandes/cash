package com.cash.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Plano.
 */
@Entity
@Table(name = "plano")
public class Plano implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "data")
    private LocalDate data;

    @Column(name = "ativo")
    private Boolean ativo;

    @Column(name = "detalhes")
    private String detalhes;

    @OneToOne
    @JoinColumn(unique = true)
    private Conta orcamento;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Plano nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getData() {
        return data;
    }

    public Plano data(LocalDate data) {
        this.data = data;
        return this;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Boolean isAtivo() {
        return ativo;
    }

    public Plano ativo(Boolean ativo) {
        this.ativo = ativo;
        return this;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getDetalhes() {
        return detalhes;
    }

    public Plano detalhes(String detalhes) {
        this.detalhes = detalhes;
        return this;
    }

    public void setDetalhes(String detalhes) {
        this.detalhes = detalhes;
    }

    public Conta getOrcamento() {
        return orcamento;
    }

    public Plano orcamento(Conta conta) {
        this.orcamento = conta;
        return this;
    }

    public void setOrcamento(Conta conta) {
        this.orcamento = conta;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Plano plano = (Plano) o;
        if (plano.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), plano.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Plano{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", data='" + getData() + "'" +
            ", ativo='" + isAtivo() + "'" +
            ", detalhes='" + getDetalhes() + "'" +
            "}";
    }
}
