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
    거제 = "거제",
    김해 = "김해",
    마산 = "마산",
    밀양 = "밀양",
    사천 = "사천",
    양산 = "양산",
    진주 = "진주",
    진해 = "진해",
    창원 = "창원",
    통영 = "통영",
    거창 = "거창",
    고성 = "고성",
    남해 = "남해",
    산청 = "산청",
    의령 = "의령",
    창녕 = "창녕",
    하동 = "하동",
    함안 = "함안",
    함양 = "함양",
    합천 = "합천"
}

export const locationMapping: Record<Location, number> = {
    [Location.거제]: 1,
    [Location.김해]: 4,
    [Location.마산]: 6,
    [Location.밀양]: 7,
    [Location.사천]: 8,
    [Location.양산]: 10,
    [Location.진주]: 13,
    [Location.진해]: 14,
    [Location.창원]: 16,
    [Location.통영]: 17,
    [Location.거창]: 2,
    [Location.고성]: 3,
    [Location.남해]: 5,
    [Location.산청]: 9,
    [Location.의령]: 12,
    [Location.창녕]: 15,
    [Location.하동]: 18,
    [Location.함안]: 19,
    [Location.함양]: 20,
    [Location.합천]: 21
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
