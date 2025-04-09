package com.rs.www.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.util.List;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String name;

	@ManyToOne
	@JoinColumn(name = "counter_id")
	private CPModel counter;

	@OneToMany(mappedBy = "category")
	@JsonIgnore
	private List<Items> items;

	// Default constructor
	public Category() {
	}

	// Getter and Setter for id
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	// Getter and Setter for name
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// Getter and Setter for counter
	public CPModel getCounter() {
		return counter;
	}

	public void setCounter(CPModel counter) {
		this.counter = counter;
	}

	// Getter and Setter for items
	public List<Items> getItems() {
		return items;
	}

	public void setItems(List<Items> items) {
		this.items = items;
	}
}
