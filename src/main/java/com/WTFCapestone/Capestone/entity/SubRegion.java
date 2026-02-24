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
public class SubRegion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    /* CHANGE: optional=false */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "localGovernanceArea_id")
    private LocalGovernanceArea localGovernanceArea;
}
