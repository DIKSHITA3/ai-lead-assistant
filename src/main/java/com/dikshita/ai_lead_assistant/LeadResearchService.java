package com.dikshita.ai_lead_assistant;

import org.springframework.stereotype.Service;

@Service
public class LeadResearchService {

    public Lead researchLead(Lead lead) {

        int score = 0;

        // International sales
        if (lead.isInternationalSales()) {
            score += 40;
        }

        // Technology industry
        if (lead.getIndustry() != null &&
                lead.getIndustry().equalsIgnoreCase("Technology")) {
            score += 30;
        }

        // International country
        if (lead.getCountry() != null &&
                !lead.getCountry().equalsIgnoreCase("India")) {
            score += 20;
        }

        // Website available
        if (lead.getWebsite() != null &&
                !lead.getWebsite().isEmpty()) {
            score += 10;
        }

        // Save calculated score
        lead.setLeadScore(score);

        // Determine priority from score
        if (score >= 80) {

            lead.setPriority("HIGH");

            lead.setAiReason(
                "The lead has strong international and business potential."
            );

        } else if (score >= 50) {

            lead.setPriority("MEDIUM");

            lead.setAiReason(
                "The lead shows moderate potential and may require further research."
            );

        } else {

            lead.setPriority("LOW");

            lead.setAiReason(
                "The lead currently shows limited signals for prioritization."
            );
        }

        return lead;
    }
}