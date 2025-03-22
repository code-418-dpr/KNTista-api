export const modulesData = [
    "Гражданское воспитание",
    "Патриотическое воспитание",
    "Культурно-творческое воспитание",
    "Научно-образовательное воспитание",
    "Спортивное воспитание",
    "Профессионально-трудовое воспитание",
].map((name, index) => ({ number: index + 1, name }));

export const eventTypesData = ["Выставка", "Донорская акция", "Пост в соц. сетях", "Хакатон", "Конференция"].map(
    (name) => ({ name }),
);

export const responsiblePersonsData = [
    "Стёпушкина П.К.",
    "Евтушенко С.Н.",
    "Денисюк Ф.В.",
    "Малеева Е.А.",
    "Голобородько Д.М.",
    "Головин Д.А.",
    "Козленко В.Д.",
    "Хорунжий Д.А.",
].map((name) => ({ name }));

export const locationsData = [
    { name: "Группа ИКНТ ВК", isOffline: false },
    { name: "Сервер Discord", isOffline: false },
    { name: "Профком обучающихся ДонНТУ", isOffline: true, address: "г. Донецк, ул. Артёма, 58" },
    { name: "1 корпус ДонНТУ", isOffline: true, address: "г. Донецк, ул. Артёма, 58" },
    { name: "Донецкий клуб доноров", isOffline: true, address: "г. Донецк, ул. Розы Люксембург, 61" },
    { name: "ЦРМИР", isOffline: true, address: "г. Донецк, ул. Пархоменко, 4А" },
];
