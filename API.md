# Jobs API

## GET /api/jobs

작업 목록을 페이지네이션, 정렬과 함께 조회한다.

### Query Parameters

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | `1` | 페이지 번호 (1부터 시작). 0 이하 값은 1로 보정 |
| `size` | int | `20` | 페이지 당 항목 수. 0 이하 값은 20으로 보정 |
| `sort_key` | string | `start_time` | 정렬 기준 필드 |
| `order` | string | `desc` | 정렬 방향 (`asc` / `desc`) |

#### sort_key 허용 값

| 값 | 설명 |
|----|------|
| `start_time` | 작업 시작 시간 (기본값) |
| `end_time` | 작업 종료 시간 |
| `id` | 작업 ID |
| `welder_id` | 용접사 ID |
| `booth_name` | 부스 이름 |

> 허용되지 않는 `sort_key`는 `start_time`으로 폴백된다.
> `order`가 `asc`가 아닌 모든 값은 `desc`로 처리된다.

### Response

```jsonc
{
  "code": 200,
  "data": [
    {
      "id": 60,
      "booth_id": 18,
      "booth_name": "Booth-001",
      "welder_id": 1,
      "welder_name": "Welder-001",
      "start_time": 1770347818421082,  // microseconds
      "end_time": 1770347842089841,
      "videos": [
        {
          "camera_id": 1,
          "camera_name": "Cam-01",
          "file_path": "W1_C1_20260206_121658421.mp4",
          "start_time": 1770347818984857,
          "end_time": 1770347842085555
        }
      ]
    }
  ],
  "page": {
    "page": 1,           // 현재 페이지
    "size": 20,          // 페이지 당 개수
    "total_count": 19,   // 전체 데이터 수
    "total_page": 1      // 전체 페이지 수
  }
}
```

### 사용 예시

```
GET /api/jobs                                          # 기본: page=1, size=20, start_time desc
GET /api/jobs?page=2&size=10                           # 2페이지, 10개씩
GET /api/jobs?page=1&size=5&sort_key=id&order=asc      # ID 오름차순
GET /api/jobs?page=1&size=5&sort_key=end_time&order=desc
```

---

## GET /api/job/:id

특정 작업의 상세 정보를 조회한다. 측정 데이터(measurements)를 포함한다.

### Path Parameters

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | int | 작업 ID |

### Response

```jsonc
{
  "code": 200,
  "data": {
    "id": 60,
    "booth_id": 18,
    "booth_name": "Booth-001",
    "welder_id": 1,
    "welder_name": "Welder-001",
    "start": 1770347818421082,
    "end": 1770347842089841,
    "videos": [
      {
        "camera_id": 1,
        "camera_name": "Cam-01",
        "file_path": "/videos/W1_C1_20260206_121658421.mp4",
        "start_time": 1770347818984857,
        "end_time": 1770347842085555
      }
    ],
    "measurements": [
      {
        "timestamp": 1770347818500000,
        "voltage": 23.5,
        "current": 180.2,
        "wire_feeding_speed": 5.3
      }
    ]
  }
}
```

> **참고**: 목록 API(`/api/jobs`)의 video `file_path`는 파일명만 반환하지만,
> 상세 API(`/api/job/:id`)는 `/videos/` 접두사가 붙은 경로를 반환한다.

---

## 공통 응답 구조

### 성공

```json
{
  "code": 200,
  "data": { ... },
  "page": { ... }  // 목록 API에서만 포함
}
```

### 실패

```json
{
  "code": 1002,
  "data": {}
}
```

### 에러 코드

| code | 설명 |
|------|------|
| `200` | 성공 |
| `1001` | 파라미터 오류 |
| `1002` | 데이터 없음 |
| `1003` | 중복 데이터 |
| `9000` | 시스템 에러 |
