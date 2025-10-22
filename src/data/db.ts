export interface Author {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name:string;
  description: string;
  price: number;
  imageUrl: string;
  gallery: string[];
  authorId: string;
  collection: string;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  text: string;
  images: string[];
  createdAt: string; // ISO 8601 date string
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export const INITIAL_AUTHORS: Author[] = [
  { id: '1', name: 'Вера Спасбкина', bio: 'Моя практика — эксперимент с медиумами и исследование пограничных, едва фиксируемых состояний, коллективных и личных травм, внутреннего мира человека. Центральной в моем творчестве становится тема ускользающего счастья. Я пишу акварелью по ткани и бумаге, использую аппликацию, складки и изгибы из ткани, добавляя трехмерность акварельной живописи, интегрирую поталь, работаю с глиной и керамикой.', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800' },
  { id: '2', name: 'Родион Артамонов', bio: 'Статуэтки Родиона и правда выбиваются из общей массы. Работает он в академической манере, только многие сюжеты у него современные. Скульптура “На краю” изображает обнажённого по пояс мужчину со смартфоном в руках. Он делает селфи, стоя при этом на краю пропасти.', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800' },
  { id: '3', name: 'Николай Чоччасов', bio: 'Автор более 40 скульптур, установленных в Якутии и Бурятии. Наиболее известные памятники — «Река Лена», «Карина» и «Дворник» и «Одуванчики». Принимал участие в создании серебряных Эллэев — статуэтка, аналогичная голливудскому «Оскару».', imageUrl: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=800' },
  { id: '4', name: 'Филипп Орлов', bio: 'Филипп Орлов — художник-монументалист, рисующий брутальных пролетариев, крестьян и лихих люмпенов. В его работах гранитная мощь сливается с гротескностью, создавая слегка грубоватые, но мощные образы. Картины Орлова могучи и широки, как хорошая деревенская драка, но утонченны, словно обсидиановый нож.', imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800' },
  { id: '5', name: 'Сослан Сосиев', bio: 'Родился в 1993г в городе Владикавказе. С 2021 является членом союза художников России. Участник многочисленных выставок в России и за рубежом. Работы находятся в частных Российских и зарубежных собраниях.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Сервиз Вавель (XVIII век)',
    description: 'Фарфоровый сервиз музейного уровня. Универсален для сервировки и коллекции.',
    price: 26000,
    imageUrl: '/images/full/02022_1066_saxon_era_in_poland-_18th-century_silver_and_porcelain_tableware_from_the_collections_of_wawel_royal_castle-210409270f.webp',
    gallery: [
      '/images/full/02022_1066_saxon_era_in_poland-_18th-century_silver_and_porcelain_tableware_from_the_collections_of_wawel_royal_castle-210409270f.webp'
    ],
    authorId: '1',
    collection: 'Фарфор'
  },
  {
    id: 'p2',
    name: 'Фарфоровый сервиз №2',
    description: 'Фарфор/столовая посуда. Элегантная форма и классическая подача.',
    price: 29000,
    imageUrl: '/img_orig/photo_2025-10-22_10-20-22.jpg?v=2',
    gallery: ['/img_orig/photo_2025-10-22_10-20-22.jpg?v=2'],
    authorId: '2',
    collection: 'Фарфор',
    isFeatured: true,
  },
  {
    id: 'p3',
    name: 'Фарфоровый сервиз №3',
    description: 'Фарфор/столовая посуда. Гармоничные пропорции и мягкий блеск глазури.',
    price: 32000,
    imageUrl: '/images/full/10917378206_071b08984f_b-2d3fb33cc1.webp',
    gallery: ['/images/full/10917378206_071b08984f_b-2d3fb33cc1.webp'],
    authorId: '3',
    collection: 'Фарфор'
  },
  {
    id: 'p4',
    name: 'Фарфоровый сервиз №4',
    description: 'Классический сервиз для домашней и ресторанной сервировки.',
    price: 35000,
    imageUrl: '/images/full/14746459546_8b5eda2d57_b-0205785cb3.webp',
    gallery: ['/images/full/14746459546_8b5eda2d57_b-0205785cb3.webp'],
    authorId: '4',
    collection: 'Фарфор'
  },
  {
    id: 'p5',
    name: 'Фарфоровый сервиз №5',
    description: 'Тонкий фарфор, аккуратный профиль, приятная тактильность.',
    price: 38000,
    imageUrl: '/images/full/20890582011_29f997bf97_b-dddca01705.webp',
    gallery: ['/images/full/20890582011_29f997bf97_b-dddca01705.webp'],
    authorId: '5',
    collection: 'Фарфор'
  },
  {
    id: 'p6',
    name: 'Фарфоровый сервиз №6',
    description: 'Универсальная коллекция для повседневной сервировки.',
    price: 41000,
    imageUrl: '/images/full/24990523287_aa6155e0b6_b-31d46416f7.webp',
    gallery: ['/images/full/24990523287_aa6155e0b6_b-31d46416f7.webp'],
    authorId: '1',
    collection: 'Фарфор'
  },
  {
    id: 'p7',
    name: 'Фарфоровый сервиз №7',
    description: 'Сбалансированные пропорции и прочная глазурь.',
    price: 44000,
    imageUrl: '/images/full/39855086922_00c8974032_b-e2cb3b8204.webp',
    gallery: ['/images/full/39855086922_00c8974032_b-e2cb3b8204.webp'],
    authorId: '2',
    collection: 'Фарфор'
  },
  {
    id: 'p8',
    name: 'Фарфоровый сервиз №8',
    description: 'Минималистичная эстетика и безупречный белый.',
    price: 47000,
    imageUrl: '/images/full/46005560_8d3e17e569_b-66290301e7.webp',
    gallery: ['/images/full/46005560_8d3e17e569_b-66290301e7.webp'],
    authorId: '3',
    collection: 'Фарфор'
  },
  {
    id: 'p9',
    name: 'Фарфоровый сервиз №9',
    description: 'Коллекция для торжественной сервировки и подарка.',
    price: 50000,
    imageUrl: '/images/full/4779547706_41861b2c26_b-51b2a86b38.webp',
    gallery: ['/images/full/4779547706_41861b2c26_b-51b2a86b38.webp'],
    authorId: '4',
    collection: 'Фарфор'
  },
  {
    id: 'p10',
    name: 'Фарфоровый сервиз №10',
    description: 'Классика жанра: чистые линии, мягкая геометрия.',
    price: 53000,
    imageUrl: '/images/full/53310292_30bf6ac4aa-fbd2f20a87.webp',
    gallery: ['/images/full/53310292_30bf6ac4aa-fbd2f20a87.webp'],
    authorId: '5',
    collection: 'Фарфор'
  },
  {
    id: 'p11',
    name: 'Фарфоровый сервиз №11',
    description: 'Прочный фарфор с устойчивой глазурью.',
    price: 56000,
    imageUrl: '/images/full/5762367215_5eb750531d_b-3ddb444804.webp',
    gallery: ['/images/full/5762367215_5eb750531d_b-3ddb444804.webp'],
    authorId: '1',
    collection: 'Фарфор'
  },
  {
    id: 'p12',
    name: 'Фарфоровый сервиз №12',
    description: 'Универсальный набор для дома и кафе.',
    price: 59000,
    imageUrl: '/images/full/6219202131_5112e36246_b-81829d7e3b.webp',
    gallery: ['/images/full/6219202131_5112e36246_b-81829d7e3b.webp'],
    authorId: '2',
    collection: 'Фарфор'
  },
  {
    id: 'p13',
    name: 'Фарфоровый сервиз №13',
    description: 'Элегантный фарфор для повседневной эстетики.',
    price: 62000,
    imageUrl: '/images/full/6247460729_3c022867c0_b-d096c3154b.webp',
    gallery: ['/images/full/6247460729_3c022867c0_b-d096c3154b.webp'],
    authorId: '3',
    collection: 'Фарфор'
  },
  {
    id: 'p14',
    name: 'Фарфоровый сервиз №14',
    description: 'Классический сервисный набор, выдержанный стиль.',
    price: 65000,
    imageUrl: '/images/full/6247492837_49219d1de3_b-85a81190bc.webp',
    gallery: ['/images/full/6247492837_49219d1de3_b-85a81190bc.webp'],
    authorId: '4',
    collection: 'Фарфор'
  },
  {
    id: 'p15',
    name: 'Фарфоровый сервиз №15',
    description: 'Коллекционный набор для подарка.',
    price: 68000,
    imageUrl: '/images/full/6247493653_849b500176_b-ceafa82cc7.webp',
    gallery: ['/images/full/6247493653_849b500176_b-ceafa82cc7.webp'],
    authorId: '5',
    collection: 'Фарфор',
    isFeatured: true,
  },
  {
    id: 'p16',
    name: 'Фарфоровый сервиз №16',
    description: 'Набор посуды с акцентом на форму и тактильность.',
    price: 71000,
    imageUrl: '/images/full/6251783497_803d8d9be3_b-6f97d0103d.webp',
    gallery: ['/images/full/6251783497_803d8d9be3_b-6f97d0103d.webp'],
    authorId: '1',
    collection: 'Фарфор'
  },
  {
    id: 'p17',
    name: 'Фарфоровый сервиз №17',
    description: 'Ровный белый, прочная глазурь, долговечность.',
    price: 74000,
    imageUrl: '/images/full/6252310538_9e4a2f9442_b-a3dff7b02f.webp',
    gallery: ['/images/full/6252310538_9e4a2f9442_b-a3dff7b02f.webp'],
    authorId: '2',
    collection: 'Фарфор'
  },
  {
    id: 'p18',
    name: 'Фарфоровый сервиз №18',
    description: 'Лаконичная геометрия и универсальные размеры.',
    price: 77000,
    imageUrl: '/images/full/6252311298_4de1d200da_b-2a293cf918.webp',
    gallery: ['/images/full/6252311298_4de1d200da_b-2a293cf918.webp'],
    authorId: '3',
    collection: 'Фарфор'
  },
  {
    id: 'p19',
    name: 'Фарфоровый сервиз №19',
    description: 'Подойдёт для минималистичных интерьеров.',
    price: 80000,
    imageUrl: '/images/full/6850726888_e6c8283b3c_b-abaa71830a.webp',
    gallery: ['/images/full/6850726888_e6c8283b3c_b-abaa71830a.webp'],
    authorId: '4',
    collection: 'Фарфор'
  },
  {
    id: 'p20',
    name: 'Фарфоровый сервиз №20',
    description: 'Классический набор для сервировки на 4–6 персон.',
    price: 83000,
    imageUrl: '/images/full/7027613657_50e275716e_b-c3fad6e22e.webp',
    gallery: ['/images/full/7027613657_50e275716e_b-c3fad6e22e.webp'],
    authorId: '5',
    collection: 'Фарфор'
  },
  {
    id: 'p21',
    name: 'Фарфоровый сервиз №21',
    description: 'Коллекция с мягким бликом глазури.',
    price: 86000,
    imageUrl: '/images/full/8169770591_4023fbf0ab_b-5cf5ac65f2.webp',
    gallery: ['/images/full/8169770591_4023fbf0ab_b-5cf5ac65f2.webp'],
    authorId: '1',
    collection: 'Фарфор'
  },
  {
    id: 'p22',
    name: 'Фарфоровый сервиз №22',
    description: 'Эстетика повседневной сервировки.',
    price: 89000,
    imageUrl: '/images/full/9067446008_bf69ffb7da-c25c1e279c.webp',
    gallery: ['/images/full/9067446008_bf69ffb7da-c25c1e279c.webp'],
    authorId: '2',
    collection: 'Фарфор'
  },
  {
    id: 'p23',
    name: 'Скульптура Майя (AMNH)',
    description: 'Керамическая скульптура Майя. Музейная коллекция.',
    price: 92000,
    imageUrl: '/images/full/ceramic_sculpture-_maya-_late_classic_period_-_mesoamerican_objects_in_the_american_museum_of_natural_history_-_dsc06040-c92893b3ac.webp',
    gallery: ['/images/full/ceramic_sculpture-_maya-_late_classic_period_-_mesoamerican_objects_in_the_american_museum_of_natural_history_-_dsc06040-c92893b3ac.webp'],
    authorId: '3',
    collection: 'Скульптуры',
    isFeatured: true,
  },
  {
    id: 'p24',
    name: 'Керамические скульптуры',
    description: 'Подборка авторских керамических скульптур.',
    price: 95000,
    imageUrl: '/images/full/ceramic_sculptures-ed8f23eb70.webp',
    gallery: ['/images/full/ceramic_sculptures-ed8f23eb70.webp'],
    authorId: '4',
    collection: 'Скульптуры'
  },
  {
    id: 'p25',
    name: 'Скульптура, Опишня (Украина)',
    description: 'Керамическая скульптура. Национальный музей украинской керамики.',
    price: 98000,
    imageUrl: '/images/full/ceramic_sculpture_with_period_photo_-_national_museum_of_ukrainian_pottery_-_opishnya_-_ukraine_-_03_-28994300697-b8bd4c6296.webp',
    gallery: ['/images/full/ceramic_sculpture_with_period_photo_-_national_museum_of_ukrainian_pottery_-_opishnya_-_ukraine_-_03_-28994300697-b8bd4c6296.webp'],
    authorId: '5',
    collection: 'Скульптуры'
  },
  {
    id: 'p26',
    name: 'Китайский фарфоровый сервиз',
    description: 'Классический китайский фарфор. Чистые линии и благородная простота.',
    price: 101000,
    imageUrl: '/images/full/chinese_porcelain_tableware-53891baf49.webp',
    gallery: ['/images/full/chinese_porcelain_tableware-53891baf49.webp'],
    authorId: '1',
    collection: 'Фарфор',
    isFeatured: true,
  },
  {
    id: 'p27',
    name: 'Уличная керамическая инсталляция (T-eb)',
    description: 'Современное прочтение керамики в городской среде.',
    price: 104000,
    imageUrl: '/images/full/overview_of_ceramic_sculpture_in_mod-nov-_street_in_t-eb-_t-eb-_district-a9ad155616.webp',
    gallery: ['/images/full/overview_of_ceramic_sculpture_in_mod-nov-_street_in_t-eb-_t-eb-_district-a9ad155616.webp'],
    authorId: '2',
    collection: 'Скульптуры'
  },
  {
    id: 'p28',
    name: 'Керамика у супермаркета (T-eb)',
    description: 'Городская керамическая скульптура. Контраст с урбан-средой.',
    price: 107000,
    imageUrl: '/images/full/overview_of_ceramic_sculpture_near_supermarket_at_mod-nov-_street_in_t-eb-_t-eb-_district-1fa21beda2.webp',
    gallery: ['/images/full/overview_of_ceramic_sculpture_near_supermarket_at_mod-nov-_street_in_t-eb-_t-eb-_district-1fa21beda2.webp'],
    authorId: '3',
    collection: 'Скульптуры'
  },
  {
    id: 'p29',
    name: 'Толита-Тумака (Эквадор)',
    description: 'Керамическая скульптура культуры Толита-Тумака.',
    price: 110000,
    imageUrl: '/images/full/tolita-tumaco_ceramic_sculpture_from_ecuador-f1c20d3eb2.webp',
    gallery: ['/images/full/tolita-tumaco_ceramic_sculpture_from_ecuador-f1c20d3eb2.webp'],
    authorId: '4',
    collection: 'Скульптуры'
  }
];

export const REVIEWS: Review[] = [
    {
        id: 'r1',
        productId: 'p1',
        authorName: 'Елена В.',
        rating: 5,
        title: 'Абсолютно восхитительно!',
        text: 'Этот сервиз превзошел все мои ожидания. Качество фарфора невероятное, а детализация просто поражает. Он стал настоящим украшением нашего дома.',
        images: [
            'https://images.unsplash.com/photo-1554583344-0b73c8808628?q=80&w=800',
            'https://images.unsplash.com/photo-1578899015201-9a71a5c093a8?q=80&w=800'
        ],
        createdAt: '2024-05-10T10:00:00Z',
        isVerifiedPurchase: true,
        status: 'approved',
    },
    {
        id: 'r2',
        productId: 'p1',
        authorName: 'Иван Петров',
        rating: 4,
        title: 'Очень красиво, но хрупко',
        text: 'Сервиз действительно музейного уровня. Выглядит потрясающе. Единственный минус — кажется очень хрупким, боюсь использовать его каждый день. Но для особых случаев — идеально.',
        images: [],
        createdAt: '2024-05-15T14:30:00Z',
        isVerifiedPurchase: true,
        status: 'approved',
    },
    {
        id: 'r3',
        productId: 'p23',
        authorName: 'Артём',
        rating: 5,
        title: 'Уникальная вещь!',
        text: 'Эта скульптура Майя — просто нечто. Она добавляет интерьеру загадочности и истории. Очень доволен покупкой, спасибо Mabon за такие находки.',
        images: ['https://images.unsplash.com/photo-1605371252895-8a033f5f38a1?q=80&w=800'],
        createdAt: '2024-04-20T09:00:00Z',
        isVerifiedPurchase: false,
        status: 'pending',
    },
    {
        id: 'r4',
        productId: 'p1',
        authorName: 'Ольга',
        rating: 5,
        title: 'Идеальный подарок',
        text: 'Покупала в подарок родителям на годовщину. Они в восторге. Сервиз упакован очень надежно, доставка была быстрой. Рекомендую!',
        images: [],
        createdAt: '2024-06-01T18:00:00Z',
        isVerifiedPurchase: true,
        status: 'approved',
    },
     {
        id: 'r5',
        productId: 'p4',
        authorName: 'Сергей',
        rating: 3,
        title: 'Неплохо, но ожидал большего',
        text: 'Хороший, качественный сервиз, но на фотографиях выглядел немного эффектнее. В целом, добротная вещь, но вау-эффекта не произошло.',
        images: [],
        createdAt: '2024-06-02T11:00:00Z',
        isVerifiedPurchase: true,
        status: 'approved',
    },
];

export const getCollections = (products: Product[]) => [...new Set(products.map(p => p.collection))].map(c => ({
    name: c,
    imageUrl: products.find(p => p.collection === c)?.imageUrl || ''
}));