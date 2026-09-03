package com.dikshita.ai_lead_assistant;

import org.springframework.stereotype.Service;

@Service
public class AIResearchService {

    public String generateResearchSummary(Lead lead) {

        String recommendation;

        if ("HIGH".equalsIgnoreCase(lead.getPriority())) {

            recommendation =
                    "Prioritize this lead for immediate outreach. " +
                    "Strong business signals indicate high growth potential.";

        } else if ("MEDIUM".equalsIgnoreCase(lead.getPriority())) {

            recommendation =
                    "Add this lead to the nurture pipeline and " +
                    "conduct additional research before outreach.";

        } else {

            recommendation =
                    "Keep this lead in the lower-priority pipeline " +
                    "and focus outreach on stronger opportunities first.";
        }

        return """
                Lead Analysis Report

                Company: %s
                Industry: %s
                Country: %s
                Lead Score: %d

                Priority: %s

                AI Reason:
                %s

                Recommendation:
                %s
                """
                .formatted(
                        lead.getCompanyName(),
                        lead.getIndustry(),
                        lead.getCountry(),
                        lead.getLeadScore(),
                        lead.getPriority(),
                        lead.getAiReason(),
                        recommendation
                );
    }
}