package com.dikshita.ai_lead_assistant;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LeadController {

    private final LeadRepository leadRepository;
    private final LeadResearchService leadResearchService;
    private final AIResearchService aiResearchService;

    public LeadController(LeadRepository leadRepository,
                      LeadResearchService leadResearchService,
                      AIResearchService aiResearchService) {
    this.leadRepository = leadRepository;
    this.leadResearchService = leadResearchService;
    this.aiResearchService = aiResearchService;
}

    @PostMapping("/api/leads")
    public Lead createLead(@RequestBody Lead lead) {
        Lead researchedLead = leadResearchService.researchLead(lead);
        return leadRepository.save(researchedLead);
    }

    @GetMapping("/api/leads")
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @GetMapping("/api/leads/{id}")
    public Lead getLeadById(@PathVariable String id) {
        return leadRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/api/leads/{id}")
    public void deleteLead(@PathVariable String id) {
        leadRepository.deleteById(id);
    }

    @PutMapping("/api/leads/{id}")
    public Lead updateLead(@PathVariable String id,
                           @RequestBody Lead updatedLead) {

        Lead existingLead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        existingLead.setCompanyName(updatedLead.getCompanyName());
        existingLead.setIndustry(updatedLead.getIndustry());
        existingLead.setCountry(updatedLead.getCountry());
        existingLead.setInternationalSales(updatedLead.isInternationalSales());

        return leadRepository.save(existingLead);
    }
    @PostMapping("/api/leads/research")
public Lead researchLead(@RequestBody Lead lead) {

    // Calculate lead priority
    Lead researchedLead = leadResearchService.researchLead(lead);

    // Generate research summary
    String summary = aiResearchService.generateResearchSummary(researchedLead);

    researchedLead.setResearchSummary(summary);

    // Save complete research result
    return leadRepository.save(researchedLead);
}
@GetMapping("/api/leads/priority/{priority}")
public List<Lead> getLeadsByPriority(@PathVariable String priority) {
    return leadRepository.findByPriorityOrderByCompanyNameAsc(priority);
}

}