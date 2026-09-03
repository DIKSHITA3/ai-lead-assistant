package com.dikshita.ai_lead_assistant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "leads")
public class Lead {

    @Id
@JsonProperty("id")
private String id;

    private String companyName;
    private String industry;
    private String country;
    private boolean internationalSales;
    private String website;
    private String leadDescription;
    private String priority;
    private int leadScore;
    private String aiReason;
    private String researchSummary;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isInternationalSales() {
        return internationalSales;
    }

    public void setInternationalSales(boolean internationalSales) {
        this.internationalSales = internationalSales;
    }
    public String getWebsite() {
    return website;
}

public void setWebsite(String website) {
    this.website = website;
}

public String getLeadDescription() {
    return leadDescription;
}

public void setLeadDescription(String leadDescription) {
    this.leadDescription = leadDescription;
}

public String getPriority() {
    return priority;
}

public void setPriority(String priority) {
    this.priority = priority;
}

public String getAiReason() {
    return aiReason;
}

public void setAiReason(String aiReason) {
    this.aiReason = aiReason;
}
public String getResearchSummary() {
    return researchSummary;
}

public void setResearchSummary(String researchSummary) {
    this.researchSummary = researchSummary;
}
public int getLeadScore() {
    return leadScore;
}

public void setLeadScore(int leadScore) {
    this.leadScore = leadScore;
}
public String getId() {
    return id;
}

public void setId(String id) {
    this.id = id;
}
}