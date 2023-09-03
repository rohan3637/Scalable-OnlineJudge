package com.example.onlinejudge.repository;

import com.example.onlinejudge.models.Question;
import com.example.onlinejudge.models.Topic;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuestionCustomRepository {

    @Autowired
    private EntityManager entityManager;

    public List<Question> getQuestionByFilters(List<String> topics, List<String> difficulties, String searchQuery, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Question> criteriaQuery = criteriaBuilder.createQuery(Question.class);
        Root<Question> root = criteriaQuery.from(Question.class);

        criteriaQuery.select(root).distinct(true)
                .where(getPredicates(root, criteriaBuilder, topics, difficulties, searchQuery));

        final TypedQuery<Question> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        return typedQuery.getResultList();
    }

    public Integer getCountByFilters(List<String> topics, List<String> difficulties, String searchQuery) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Question> countRoot = countQuery.from(Question.class);

        countQuery.select(criteriaBuilder.countDistinct(countRoot))
                .where(criteriaBuilder.and(getPredicates(countRoot, criteriaBuilder, topics, difficulties, searchQuery)));

        return Math.toIntExact(entityManager.createQuery(countQuery).getSingleResult());
    }

    private Predicate[] getPredicates(Root<Question> root, CriteriaBuilder criteriaBuilder,
                List<String> topics, List<String> difficulties, String searchQuery) {
        List<Predicate> predicates = new ArrayList<>();
        Predicate defaultPredicate = criteriaBuilder.isNotNull(root.get("questionId"));
        predicates.add(defaultPredicate);
        if(topics != null) {
            Join<Question, Topic> topicsJoin = root.join("topics", JoinType.LEFT);
            Predicate topicPredicate = topicsJoin.get("topicName").in(topics);
            predicates.add(topicPredicate);
        }
        if(difficulties != null) {
            Predicate difficultyPredicate = root.get("difficulty").in(difficulties);
            predicates.add(difficultyPredicate);
        }
        if (searchQuery != null) {
            Predicate titleSearchPredicate = criteriaBuilder.like(root.get("title"), "%" + searchQuery + "%");
            Predicate descriptionSearchPredicate = criteriaBuilder.like(root.get("description"), "%" + searchQuery + "%");

            Predicate searchPredicate = criteriaBuilder.or(titleSearchPredicate, descriptionSearchPredicate);
            predicates.add(searchPredicate);
        }
        return predicates.toArray(new Predicate[predicates.size()]);
    }
}
