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

export enum Cities {
    거제 = "거제",
    김해 = "김해",
    마산 = "마산",
    밀양 = "밀양",
    사천 = "사천",
    양산 = "양산",
    진주 = "진주",
    진해 = "진해",
    창원 = "창원",
    통영 = "통영"
}

export enum Counties {
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

export const cityMapping: Record<Cities, string> = {
    [Cities.거제]: "1",
    [Cities.김해]: "4",
    [Cities.마산]: "6",
    [Cities.밀양]: "7",
    [Cities.사천]: "8",
    [Cities.양산]: "10",
    [Cities.진주]: "13",
    [Cities.진해]: "14",
    [Cities.창원]: "16",
    [Cities.통영]: "17"
};

export const countyMapping: Record<Counties, string> = {
    [Counties.거창]: "2",
    [Counties.고성]: "3",
    [Counties.남해]: "5",
    [Counties.산청]: "9",
    [Counties.의령]: "12",
    [Counties.창녕]: "15",
    [Counties.하동]: "18",
    [Counties.함안]: "19",
    [Counties.함양]: "20",
    [Counties.합천]: "21"
};


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
