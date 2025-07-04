---
title: "우선순위 큐와 힙"
slug: "priority-queue-and-heap"
date: 2025-01-11
tags: ["PriorityQueue", "Heap"]
category: "CS/Data Structure"
draft: true
views: 0
---
## 우선순위 큐(Priority Queue)

**큐**는 FIFO(First In First Out) 방식의 자료구조로, 먼저 들어온 데이터가 먼저 나가는 특징을 가진다.
**우선순위 큐**는 기본적인 큐와 달리 데이터가 들어오는 순서가 아닌, 각 데이터가 가진 우선순위(priority)에 따라 먼저 나가는 자료구조다.

우선순위 큐를 구현하기 위해 고안된 자료구조가 힙이다.

### 힙(Heap)

힙은 완전이진트리 형태의 계층적 자료구조로, 각 노드는 자식 노드와 특정 관계를 유지한다. 힙은 다음의 특징을 가진다.

- 완전이진트리 구조
    - 마지막 레벨을 제외한 모든 레벨이 완전히 채워져 있음
    - 마지막 레벨은 왼쪽부터 순차적으로 채워짐
- 힙 속성
    - 최대 힙(Max Heap): 부모 노드의 값 ≥ 자식 노드의 값
    - 최소 힙(Min Heap): 부모 노드의 값 ≤ 자식 노드의 값

### 구현

힙은 일차원 배열로 구현할 수 있다. 완전이진트리의 특성상 빈 공간 없이 순차적으로 데이터를 저장할 수 있기 때문이다.

#### 배열에서의 노드 관계
- 왼쪽 자식 노드 = i * 2
- 오른쪽 자식 노드 = i * 2 + 1
- 부모 노드 = i / 2 (정수 나눗셈)

#### 구현 예시



