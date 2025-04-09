package com.rs.www.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class Items {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	private String name;

	private String quantity;

	private double price;
	private String status; // Should be either "Available" or "Not Available"

	@ManyToOne
	@JoinColumn(name = "counter_id", nullable = false)
	@JsonBackReference
	private CPModel counter;

	@ManyToOne
	@JoinColumn(name="category")
	private Category category;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public CPModel getCounter() {
		return counter;
	}

	public void setCounter(CPModel counter) {
		this.counter = counter;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}
