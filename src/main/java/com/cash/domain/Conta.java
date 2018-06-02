package com.cash.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import com.cash.domain.enumeration.Destino;

import com.cash.domain.enumeration.Area;

import com.cash.domain.enumeration.Recurso;

/**
 * A Conta.
 */
@Entity
@Table(name = "conta")
public class Conta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "valor")
    private Float valor;

    @Column(name = "data")
    private LocalDate data;

    @Column(name = "parcelas")
    private Integer parcelas;

    @Column(name = "isentrada")
    private Boolean isentrada;

    @Column(name = "ativo")
    private Boolean ativo;

    @Enumerated(EnumType.STRING)
    @Column(name = "destino")
    private Destino destino;

    @Enumerated(EnumType.STRING)
    @Column(name = "area")
    private Area area;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurso")
    private Recurso recurso;

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

    public Conta nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Float getValor() {
        return valor;
    }

    public Conta valor(Float valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }

    public Conta data(LocalDate data) {
        this.data = data;
        return this;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Integer getParcelas() {
        return parcelas;
    }

    public Conta parcelas(Integer parcelas) {
        this.parcelas = parcelas;
        return this;
    }

    public void setParcelas(Integer parcelas) {
        this.parcelas = parcelas;
    }

    public Boolean isIsentrada() {
        return isentrada;
    }

    public Conta isentrada(Boolean isentrada) {
        this.isentrada = isentrada;
        return this;
    }

    public void setIsentrada(Boolean isentrada) {
        this.isentrada = isentrada;
    }

    public Boolean isAtivo() {
        return ativo;
    }

    public Conta ativo(Boolean ativo) {
        this.ativo = ativo;
        return this;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Destino getDestino() {
        return destino;
    }

    public Conta destino(Destino destino) {
        this.destino = destino;
        return this;
    }

    public void setDestino(Destino destino) {
        this.destino = destino;
    }

    public Area getArea() {
        return area;
    }

    public Conta area(Area area) {
        this.area = area;
        return this;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public Recurso getRecurso() {
        return recurso;
    }

    public Conta recurso(Recurso recurso) {
        this.recurso = recurso;
        return this;
    }

    public void setRecurso(Recurso recurso) {
        this.recurso = recurso;
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
        Conta conta = (Conta) o;
        if (conta.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), conta.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Conta{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", valor=" + getValor() +
            ", data='" + getData() + "'" +
            ", parcelas=" + getParcelas() +
            ", isentrada='" + isIsentrada() + "'" +
            ", ativo='" + isAtivo() + "'" +
            ", destino='" + getDestino() + "'" +
            ", area='" + getArea() + "'" +
            ", recurso='" + getRecurso() + "'" +
            "}";
    }
}
