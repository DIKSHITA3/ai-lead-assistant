package com.dikshita.ai_lead_assistant;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeadRepository extends MongoRepository<Lead, String> {

    List<Lead> findByPriorityOrderByCompanyNameAsc(String priority);

}