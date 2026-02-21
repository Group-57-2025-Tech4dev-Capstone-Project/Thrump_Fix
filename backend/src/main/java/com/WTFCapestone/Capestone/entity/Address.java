package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String houseNumber;
    private String streetName;

    @ManyToOne
    private State state;

    @ManyToOne
    private LocalGovernanceArea localGovernanceArea;

    @ManyToOne
    private SubRegion subRegion;
}
