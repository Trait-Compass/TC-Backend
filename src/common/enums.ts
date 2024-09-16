export enum MBTI {
    EMPTY = "EMPTY",
    ISTJ = "ISTJ",
    ISFJ = "ISFJ",
    INFJ = "INFJ",
    INTJ = "INTJ",
    ISTP = "ISTP",
    ISFP = "ISFP",
    INFP = "INFP",
    INTP = "INTP",
    ESTP = "ESTP",
    ESFP = "ESFP",
    ENFP = "ENFP",
    ENTP = "ENTP",
    ESTJ = "ESTJ",
    ESFJ = "ESFJ",
    ENFJ = "ENFJ",
    ENTJ = "ENTJ"
}

export const mbtiKeywords: Record<MBTI, number[]> = {
    [MBTI.EMPTY]: [],
    [MBTI.ISTJ]: [2, 17, 4], // 역사, 전시, 축제
    [MBTI.ISFJ]: [12, 5, 16, 2], // 자연, 공원, 마을, 역사
    [MBTI.INFJ]: [14, 12, 13, 16], // 경치, 자연, 야경, 마을
    [MBTI.INTJ]: [17, 9, 2, 13], // 전시, 드라이브, 역사, 야경
    [MBTI.ISTP]: [7, 9, 8, 12], // 레포츠, 드라이브, 산, 자연
    [MBTI.ISFP]: [12, 10, 5, 16], // 자연, 해변, 공원, 마을
    [MBTI.INFP]: [10, 12, 14, 16], // 해변, 자연, 경치, 마을
    [MBTI.INTP]: [2, 17, 5, 12], // 역사, 전시, 공원, 자연
    [MBTI.ESTP]: [7, 4, 6, 11], // 레포츠, 축제, 놀이공원, 시장
    [MBTI.ESFP]: [6, 4, 11, 10], // 놀이공원, 축제, 시장, 해변
    [MBTI.ENFP]: [4, 6, 10, 14], // 축제, 놀이공원, 해변, 경치
    [MBTI.ENTP]: [17, 4, 11, 14], // 전시, 축제, 시장, 경치
    [MBTI.ESTJ]: [2, 4, 17, 11], // 역사, 축제, 전시, 시장
    [MBTI.ESFJ]: [4, 11, 10, 5], // 축제, 시장, 해변, 공원
    [MBTI.ENFJ]: [14, 12, 16, 10], // 경치, 자연, 마을, 해변
    [MBTI.ENTJ]: [17, 2, 9, 13] // 전시, 역사, 드라이브, 야경
};

export enum Location {
    거제시 = "거제시",   // City
    김해시 = "김해시",   // City
    마산시 = "마산시",   // City
    밀양시 = "밀양시",   // City
    사천시 = "사천시",   // City
    양산시 = "양산시",   // City
    진주시 = "진주시",   // City
    진해시 = "진해시",   // City
    창원시 = "창원시",   // City
    통영시 = "통영시",   // City
    거창군 = "거창군",   // County
    고성군 = "고성군",   // County
    남해군 = "남해군",   // County
    산청군 = "산청군",   // County
    의령군 = "의령군",   // County
    창녕군 = "창녕군",   // County
    하동군 = "하동군",   // County
    함안군 = "함안군",   // County
    함양군 = "함양군",   // County
    합천군 = "합천군",   // County
}

export const locationMapping: Record<Location, number> = {
    [Location.거제시]: 1,
    [Location.김해시]: 4,
    [Location.마산시]: 6,
    [Location.밀양시]: 7,
    [Location.사천시]: 8,
    [Location.양산시]: 10,
    [Location.진주시]: 13,
    [Location.진해시]: 14,
    [Location.창원시]: 16,
    [Location.통영시]: 17,
    [Location.거창군]: 2,
    [Location.고성군]: 3,
    [Location.남해군]: 5,
    [Location.산청군]: 9,
    [Location.의령군]: 12,
    [Location.창녕군]: 15,
    [Location.하동군]: 18,
    [Location.함안군]: 19,
    [Location.함양군]: 20,
    [Location.합천군]: 21
};

export enum Companion {
    ALONE = "혼자",
    COUPLE = "커플",
    FRIEND = "친구",
    FRIENDS = "친구들",
    WITH_CHILD = "아이와 함께",
    WITH_PARENTS= "부모님과 함께"
}

export enum Category {
    TouristAttraction = "12", // 관광지
    CulturalFacility = "14",  // 문화시설
    TravelCourse = "25",      // 여행코스
    LeisureSports = "28"     // 레포츠
}

export enum ROLE {
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum GENDER {
    M = "M",
    F = "F"
}

export enum Keyword {
    RIVER = "강",          // 1
    HISTORY = "역사",      // 2
    EXPERIENCE = "체험",   // 3
    FESTIVAL = "축제",     // 4
    PARK = "공원",         // 5
    AMUSEMENT = "놀이공원", // 6
    LEPORTS = "레포츠",    // 7
    MOUNTAIN = "산",       // 8
    DRIVE = "드라이브",    // 9
    BEACH = "해변",        // 10
    MARKET = "시장",       // 11
    NATURE = "자연",       // 12
    NIGHT_VIEW = "야경",   // 13
    VIEW = "경치",         // 14
    HARBOR = "항구",       // 15
    VILLAGE = "마을",      // 16
    EXHIBITION = "전시"    // 17
}

export const keywordMapping: Record<Keyword, number> = {
    [Keyword.RIVER]: 1,
    [Keyword.HISTORY]: 2,
    [Keyword.EXPERIENCE]: 3,
    [Keyword.FESTIVAL]: 4,
    [Keyword.PARK]: 5,
    [Keyword.AMUSEMENT]: 6,
    [Keyword.LEPORTS]: 7,
    [Keyword.MOUNTAIN]: 8,
    [Keyword.DRIVE]: 9,
    [Keyword.BEACH]: 10,
    [Keyword.MARKET]: 11,
    [Keyword.NATURE]: 12,
    [Keyword.NIGHT_VIEW]: 13,
    [Keyword.VIEW]: 14,
    [Keyword.HARBOR]: 15,
    [Keyword.VILLAGE]: 16,
    [Keyword.EXHIBITION]: 17,
};

export const reverseKeywordMapping: Record<number, Keyword> = {};

for (const [key, value] of Object.entries(keywordMapping)) {
    reverseKeywordMapping[value] = key as Keyword;
}

export enum Happy {
    JOY = '기쁨',
    FUN = '재미있음',
    ENJOYMENT = '즐거움',
    LIVELY = '활기참',
    EXCITEMENT = '황홀함',
    GRATEFUL = '감사함',
}

export enum Satisfied {
    ACHIEVEMENT = '성취감',
    EMOTIONAL = '감동적임',
    STABILITY = '안정감',
    SATISFACTION = '만족감',
    FULFILLMENT = '호뭇함',
    RESERVED = '보람참',
}

export enum Comfortable {
    RELAXED = '안락함',
    WARM = '따뜻함',
    PEACEFUL = '평화로움',
    RELIEF = '여유로움',
    REST = '휴식',
}

export enum Surprised {
    AMAZEMENT = '감탄',
    WONDER = '경이로움',
    CURIOSITY = '신비로움',
    SURPRISE = '깜짝 놀람',
    DISCOVERY = '새로운 발견',
}

export enum Disappointed {
    DISAPPOINTMENT = '아쉬움',
    EXHAUSTION = '허탈함',
    REGRET = '후회',
    FRUSTRATION = '좌절',
    HELPLESS = '답답함',
    DESPAIR = '막막함',
}

export enum Sad {
    TEARS = '눈물',
    DEPRESSION = '우울함',
    DESPAIR_SAD = '절망감',
    LONELINESS = '침울함',
    SORROW = '쓸쓸함',
}

export enum Angry {
    ANNOYED = '짜증',
    ANGER = '분노',
    RESENTMENT = '억울함',
    INDIFFERENCE = '어이없음',
    UNFAIR = '불쾌함',
}

export enum Nature {
    T = 'T',
    F = 'F'
}

export const mbtiMatchups: Record<MBTI, { chalTeok: MBTI, hwanJang: MBTI }> = {
    EMPTY: { chalTeok: MBTI.EMPTY, hwanJang: MBTI.EMPTY },
    ISTJ: { chalTeok: MBTI.ESFP, hwanJang: MBTI.ENFP },
    ISFJ: { chalTeok: MBTI.ESTP, hwanJang: MBTI.ENTP },
    INFJ: { chalTeok: MBTI.ENFP, hwanJang: MBTI.ESTP },
    INTJ: { chalTeok: MBTI.ENTP, hwanJang: MBTI.ISFP },
    ISTP: { chalTeok: MBTI.ESFJ, hwanJang: MBTI.ENFJ },
    ISFP: { chalTeok: MBTI.ESFJ, hwanJang: MBTI.INFJ },
    INFP: { chalTeok: MBTI.ENFJ, hwanJang: MBTI.ENTJ },
    INTP: { chalTeok: MBTI.ENTJ, hwanJang: MBTI.ISFJ },
    ESTP: { chalTeok: MBTI.ISFP, hwanJang: MBTI.INFJ },
    ESFP: { chalTeok: MBTI.ISTJ, hwanJang: MBTI.INFJ },
    ENFP: { chalTeok: MBTI.INFJ, hwanJang: MBTI.INTJ },
    ENTP: { chalTeok: MBTI.INTJ, hwanJang: MBTI.ISFJ },
    ESTJ: { chalTeok: MBTI.ISFJ, hwanJang: MBTI.INFP },
    ESFJ: { chalTeok: MBTI.ISTP, hwanJang: MBTI.INFP },
    ENFJ: { chalTeok: MBTI.INFP, hwanJang: MBTI.ISTP },
    ENTJ: { chalTeok: MBTI.INTP, hwanJang: MBTI.ISFP }
};


export const mbtiDescriptions: Record<MBTI, string[]> = {
    EMPTY: [],
    ISTJ: ["항상 모든 것을 계획하고 준비하는 타입", "여행 중 규칙과 질서를 중시"],
    ISFJ: ["다른 사람들을 먼저 생각하고 돕는 타입", "여행 중 편안함과 안정감을 중요시함"],
    INFJ: ["조용하고 깊이 있는 여행을 선호하는 타입", "혼자만의 시간과 내면의 성장이 중요"],
    INTJ: ["효율적인 여행을 계획하는 타입", "단체 여행보다는 독립적인 여행을 선호"],
    ISTP: ["계획 없이 자유롭게 여행하는 타입", "액티비티와 모험을 즐김"],
    ISFP: ["자연과 예술을 사랑하는 타입", "행복하고 아름다운 장소를 찾는 것을 좋아함"],
    INFP: ["영감을 갈구하는 여행을 즐기는 타입", "타인의 이야기나 문화 탐구에 흥미를 가짐"],
    INTP: ["지적 호기심을 만족시키기 위해 여행하는 타입", "역사적이거나 과학적인 장소를 선호"],
    ESTP: ["모험과 스릴을 즐기는 타입", "즉흥적이고 활기찬 여행을 선호"],
    ESFP: ["사교적이고 활기찬 여행을 즐기는 타입", "다양한 사람들과 어울려 여행을 즐김"],
    ENFP: ["깊이 여행하기를 즐기는 타입", "구체적인 계획을 잘 안 세우는 타입"],
    ENTP: ["새로운 아이디어를 경험하고 싶어하는 타입", "전통적인 여행보다는 독특한 여행을 선호"],
    ESTJ: ["계획적이고 효율적으로 여행을 이끄는 타입", "단체 여행에서 리더 역할을 자처"],
    ESFJ: ["동행자의 관계를 중요하게 생각하는 타입", "일정과 장소를 신중하게 선택하여 모두가 만족하는 여행을 추구"],
    ENFJ: ["사람들과의 연결을 중요하게 여기는 타입", "여행을 통해 새로운 인연을 만들고 영감을 얻음"],
    ENTJ: ["목표를 세우고 이를 달성하는 여행을 선호", "리더십을 발휘하여 단체 여행을 이끄는 역할"]
};
