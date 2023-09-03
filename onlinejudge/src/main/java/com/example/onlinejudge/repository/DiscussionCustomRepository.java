package com.example.onlinejudge.repository;

import com.example.onlinejudge.models.Discussion;
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
public class DiscussionCustomRepository {

    @Autowired
    private EntityManager entityManager;

    public List<Discussion> getDiscussionBySearch(String questionId, String searchQuery, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Discussion> criteriaQuery = criteriaBuilder.createQuery(Discussion.class);
        Root<Discussion> root = criteriaQuery.from(Discussion.class);

        criteriaQuery.select(root).distinct(true)
                .where(getPredicates(root, criteriaBuilder, questionId, searchQuery));

        final TypedQuery<Discussion> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        return typedQuery.getResultList();
    }

    public Integer getDiscussionCount(String questionId, String searchQuery) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Discussion> countRoot = countQuery.from(Discussion.class);

        countQuery.select(criteriaBuilder.countDistinct(countRoot))
                .where(criteriaBuilder.and(getPredicates(countRoot, criteriaBuilder, questionId, searchQuery)));

        return Math.toIntExact(entityManager.createQuery(countQuery).getSingleResult());
    }

    private Predicate[] getPredicates(Root<Discussion> root, CriteriaBuilder criteriaBuilder, String questionId, String searchQuery) {
        List<Predicate> predicates = new ArrayList<>();
        Predicate defaultPredicate = criteriaBuilder.equal(root.get("questionId"), questionId);
        predicates.add(defaultPredicate);
        if (searchQuery != null) {
            Predicate titleSearchPredicate = criteriaBuilder.like(root.get("title"), "%" + searchQuery + "%");
            Predicate commentSearchPredicate = criteriaBuilder.like(root.get("comment"), "%" + searchQuery + "%");

            Predicate searchPredicate = criteriaBuilder.or(titleSearchPredicate, commentSearchPredicate);
            predicates.add(searchPredicate);
        }
        return predicates.toArray(new Predicate[predicates.size()]);
    }
}
