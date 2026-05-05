package com.saisadwiik.skillbridge_backend.models;

import com.saisadwiik.skillbridge_backend.Enum.BidStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="bids")
@Getter
@Setter
public class Bid {
    @Id
    @GeneratedValue(strategy=
        GenerationType.IDENTITY
    )
    private Long id;
    private Double bidAmount;
    private String proposalMessage;
    @Enumerated(EnumType.STRING)
    private BidStatus status = BidStatus.PENDING;
    @ManyToOne
    @JoinColumn(name="project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name="freelancer_id")
    private User freelancer;


}
