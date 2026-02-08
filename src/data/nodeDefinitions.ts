import { NodeDefinition } from '@/types/workflow';

export type { NodeDefinition };

export const nodeDefinitions: NodeDefinition[] = [
  // === INPUT NODES ===
  {
    type: 'csv-reader',
    category: 'input',
    label: 'CSV Reader',
    description: 'قراءة ملفات CSV',
    icon: 'FileSpreadsheet',
    inputs: 0,
    outputs: 1,
    parameters: [
      { id: 'file', name: 'الملف', type: 'file', value: null, required: true },
      { id: 'delimiter', name: 'الفاصل', type: 'select', value: ',', options: [
        { label: 'فاصلة', value: ',' },
        { label: 'فاصلة منقوطة', value: ';' },
        { label: 'Tab', value: '\t' },
      ]},
      { id: 'hasHeader', name: 'يحتوي على عناوين', type: 'boolean', value: true },
    ],
  },
  {
    type: 'excel-reader',
    category: 'input',
    label: 'Excel Reader',
    description: 'قراءة ملفات Excel',
    icon: 'FileType',
    inputs: 0,
    outputs: 1,
    parameters: [
      { id: 'file', name: 'الملف', type: 'file', value: null, required: true },
      { id: 'sheet', name: 'الورقة', type: 'string', value: '', placeholder: 'Sheet1' },
    ],
  },
  {
    type: 'data-generator',
    category: 'input',
    label: 'Data Generator',
    description: 'توليد بيانات عشوائية',
    icon: 'Dices',
    inputs: 0,
    outputs: 1,
    parameters: [
      { id: 'rows', name: 'عدد الصفوف', type: 'number', value: 100, min: 1, max: 10000 },
      { id: 'columns', name: 'عدد الأعمدة', type: 'number', value: 5, min: 1, max: 50 },
      { id: 'seed', name: 'البذرة', type: 'number', value: 42 },
    ],
  },
  {
    type: 'sql-reader',
    category: 'input',
    label: 'SQL Reader',
    description: 'قراءة من قاعدة بيانات',
    icon: 'Database',
    inputs: 0,
    outputs: 1,
    parameters: [
      { id: 'query', name: 'الاستعلام', type: 'string', value: '', placeholder: 'SELECT * FROM table' },
      { id: 'connection', name: 'الاتصال', type: 'string', value: '' },
    ],
  },

  // === PROCESSING NODES ===
  {
    type: 'filter-rows',
    category: 'processing',
    label: 'Filter Rows',
    description: 'تصفية الصفوف',
    icon: 'Filter',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'column', name: 'العمود', type: 'string', value: '', required: true },
      { id: 'operator', name: 'المعامل', type: 'select', value: '==', options: [
        { label: 'يساوي', value: '==' },
        { label: 'لا يساوي', value: '!=' },
        { label: 'أكبر من', value: '>' },
        { label: 'أصغر من', value: '<' },
        { label: 'يحتوي على', value: 'contains' },
      ]},
      { id: 'value', name: 'القيمة', type: 'string', value: '' },
    ],
  },
  {
    type: 'select-columns',
    category: 'processing',
    label: 'Column Filter',
    description: 'اختيار الأعمدة',
    icon: 'Columns3',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'columns', name: 'الأعمدة', type: 'string', value: '', placeholder: 'col1, col2, col3' },
      { id: 'exclude', name: 'استثناء', type: 'boolean', value: false },
    ],
  },
  {
    type: 'missing-value',
    category: 'processing',
    label: 'Missing Value',
    description: 'معالجة القيم المفقودة',
    icon: 'CircleSlash',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'method', name: 'الطريقة', type: 'select', value: 'mean', options: [
        { label: 'المتوسط', value: 'mean' },
        { label: 'الوسيط', value: 'median' },
        { label: 'المنوال', value: 'mode' },
        { label: 'حذف', value: 'drop' },
        { label: 'قيمة ثابتة', value: 'constant' },
      ]},
      { id: 'constantValue', name: 'القيمة الثابتة', type: 'string', value: '0' },
    ],
  },
  {
    type: 'normalizer',
    category: 'processing',
    label: 'Normalizer',
    description: 'تطبيع البيانات',
    icon: 'Scale',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'method', name: 'الطريقة', type: 'select', value: 'minmax', options: [
        { label: 'Min-Max', value: 'minmax' },
        { label: 'Z-Score', value: 'zscore' },
        { label: 'Decimal Scaling', value: 'decimal' },
      ]},
      { id: 'columns', name: 'الأعمدة', type: 'string', value: '', placeholder: 'الكل أو أعمدة محددة' },
    ],
  },
  {
    type: 'joiner',
    category: 'processing',
    label: 'Joiner',
    description: 'دمج جدولين',
    icon: 'Merge',
    inputs: 2,
    outputs: 1,
    parameters: [
      { id: 'leftKey', name: 'مفتاح اليسار', type: 'string', value: '', required: true },
      { id: 'rightKey', name: 'مفتاح اليمين', type: 'string', value: '', required: true },
      { id: 'joinType', name: 'نوع الدمج', type: 'select', value: 'inner', options: [
        { label: 'Inner', value: 'inner' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'Outer', value: 'outer' },
      ]},
    ],
  },

  // === ANALYSIS NODES ===
  {
    type: 'statistics',
    category: 'analysis',
    label: 'Statistics',
    description: 'إحصاءات وصفية',
    icon: 'BarChart3',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'measures', name: 'المقاييس', type: 'multiselect', value: ['mean', 'std', 'min', 'max'], options: [
        { label: 'المتوسط', value: 'mean' },
        { label: 'الانحراف المعياري', value: 'std' },
        { label: 'الحد الأدنى', value: 'min' },
        { label: 'الحد الأقصى', value: 'max' },
        { label: 'الوسيط', value: 'median' },
        { label: 'التباين', value: 'variance' },
      ]},
    ],
  },
  {
    type: 'correlation',
    category: 'analysis',
    label: 'Correlation',
    description: 'تحليل الارتباط',
    icon: 'Waypoints',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'method', name: 'الطريقة', type: 'select', value: 'pearson', options: [
        { label: 'Pearson', value: 'pearson' },
        { label: 'Spearman', value: 'spearman' },
        { label: 'Kendall', value: 'kendall' },
      ]},
    ],
  },
  {
    type: 'hypothesis-test',
    category: 'analysis',
    label: 'Hypothesis Test',
    description: 'اختبار الفروض',
    icon: 'FlaskConical',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'testType', name: 'نوع الاختبار', type: 'select', value: 'ttest', options: [
        { label: 'T-Test', value: 'ttest' },
        { label: 'Chi-Square', value: 'chisquare' },
        { label: 'ANOVA', value: 'anova' },
        { label: 'Mann-Whitney', value: 'mannwhitney' },
      ]},
      { id: 'alpha', name: 'مستوى الدلالة', type: 'number', value: 0.05, min: 0.01, max: 0.1 },
    ],
  },
  {
    type: 'groupby',
    category: 'analysis',
    label: 'GroupBy',
    description: 'تجميع البيانات',
    icon: 'Layers',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'groupColumns', name: 'أعمدة التجميع', type: 'string', value: '', required: true },
      { id: 'aggregation', name: 'دالة التجميع', type: 'select', value: 'sum', options: [
        { label: 'المجموع', value: 'sum' },
        { label: 'المتوسط', value: 'mean' },
        { label: 'العدد', value: 'count' },
        { label: 'الحد الأقصى', value: 'max' },
        { label: 'الحد الأدنى', value: 'min' },
      ]},
    ],
  },

  // === MODELING NODES ===
  {
    type: 'linear-regression',
    category: 'modeling',
    label: 'Linear Regression',
    description: 'الانحدار الخطي',
    icon: 'TrendingUp',
    inputs: 1,
    outputs: 2,
    parameters: [
      { id: 'target', name: 'المتغير التابع', type: 'string', value: '', required: true },
      { id: 'features', name: 'المتغيرات المستقلة', type: 'string', value: '', placeholder: 'x1, x2, x3' },
      { id: 'fitIntercept', name: 'احسب الثابت', type: 'boolean', value: true },
    ],
  },
  {
    type: 'decision-tree',
    category: 'modeling',
    label: 'Decision Tree',
    description: 'شجرة القرار',
    icon: 'GitBranch',
    inputs: 1,
    outputs: 2,
    parameters: [
      { id: 'target', name: 'المتغير التابع', type: 'string', value: '', required: true },
      { id: 'maxDepth', name: 'العمق الأقصى', type: 'number', value: 5, min: 1, max: 20 },
      { id: 'minSamples', name: 'الحد الأدنى للعينات', type: 'number', value: 2, min: 1 },
    ],
  },
  {
    type: 'kmeans',
    category: 'modeling',
    label: 'K-Means',
    description: 'تجميع K-Means',
    icon: 'CircleDot',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'nClusters', name: 'عدد العناقيد', type: 'number', value: 3, min: 2, max: 20 },
      { id: 'maxIter', name: 'الحد الأقصى للتكرارات', type: 'number', value: 100 },
      { id: 'randomState', name: 'البذرة', type: 'number', value: 42 },
    ],
  },
  {
    type: 'random-forest',
    category: 'modeling',
    label: 'Random Forest',
    description: 'الغابة العشوائية',
    icon: 'Trees',
    inputs: 1,
    outputs: 2,
    parameters: [
      { id: 'target', name: 'المتغير التابع', type: 'string', value: '', required: true },
      { id: 'nEstimators', name: 'عدد الأشجار', type: 'number', value: 100, min: 10, max: 500 },
      { id: 'maxDepth', name: 'العمق الأقصى', type: 'number', value: 10, min: 1, max: 50 },
    ],
  },

  // === TIME SERIES NODES ===
  {
    type: 'arima',
    category: 'timeseries',
    label: 'ARIMA',
    description: 'نموذج ARIMA',
    icon: 'Activity',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'p', name: 'p (AR)', type: 'number', value: 1, min: 0, max: 10 },
      { id: 'd', name: 'd (Differencing)', type: 'number', value: 1, min: 0, max: 3 },
      { id: 'q', name: 'q (MA)', type: 'number', value: 1, min: 0, max: 10 },
      { id: 'column', name: 'عمود السلسلة', type: 'string', value: '', required: true },
    ],
  },
  {
    type: 'seasonal-decompose',
    category: 'timeseries',
    label: 'Seasonal Decompose',
    description: 'التحليل الموسمي',
    icon: 'CalendarRange',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'model', name: 'النموذج', type: 'select', value: 'additive', options: [
        { label: 'جمعي', value: 'additive' },
        { label: 'ضربي', value: 'multiplicative' },
      ]},
      { id: 'period', name: 'الفترة', type: 'number', value: 12, min: 2 },
    ],
  },
  {
    type: 'stationarity-test',
    category: 'timeseries',
    label: 'Stationarity Test',
    description: 'اختبار الاستقرارية',
    icon: 'TestTube',
    inputs: 1,
    outputs: 1,
    parameters: [
      { id: 'test', name: 'نوع الاختبار', type: 'select', value: 'adf', options: [
        { label: 'ADF Test', value: 'adf' },
        { label: 'KPSS Test', value: 'kpss' },
        { label: 'PP Test', value: 'pp' },
      ]},
    ],
  },

  // === OUTPUT NODES ===
  {
    type: 'table-view',
    category: 'output',
    label: 'Table View',
    description: 'عرض جدولي',
    icon: 'Table',
    inputs: 1,
    outputs: 0,
    parameters: [
      { id: 'maxRows', name: 'الحد الأقصى للصفوف', type: 'number', value: 100 },
      { id: 'showIndex', name: 'إظهار الفهرس', type: 'boolean', value: true },
    ],
  },
  {
    type: 'scatter-plot',
    category: 'output',
    label: 'Scatter Plot',
    description: 'رسم التشتت',
    icon: 'ScatterChart',
    inputs: 1,
    outputs: 0,
    parameters: [
      { id: 'xColumn', name: 'المحور X', type: 'string', value: '', required: true },
      { id: 'yColumn', name: 'المحور Y', type: 'string', value: '', required: true },
      { id: 'colorColumn', name: 'عمود اللون', type: 'string', value: '' },
    ],
  },
  {
    type: 'line-chart',
    category: 'output',
    label: 'Line Chart',
    description: 'رسم بياني خطي',
    icon: 'LineChart',
    inputs: 1,
    outputs: 0,
    parameters: [
      { id: 'xColumn', name: 'المحور X', type: 'string', value: '', required: true },
      { id: 'yColumns', name: 'أعمدة Y', type: 'string', value: '', placeholder: 'y1, y2' },
    ],
  },
  {
    type: 'bar-chart',
    category: 'output',
    label: 'Bar Chart',
    description: 'رسم بياني شريطي',
    icon: 'BarChart',
    inputs: 1,
    outputs: 0,
    parameters: [
      { id: 'xColumn', name: 'المحور X', type: 'string', value: '', required: true },
      { id: 'yColumn', name: 'المحور Y', type: 'string', value: '', required: true },
      { id: 'horizontal', name: 'أفقي', type: 'boolean', value: false },
    ],
  },
  {
    type: 'csv-writer',
    category: 'output',
    label: 'CSV Writer',
    description: 'كتابة ملف CSV',
    icon: 'FileOutput',
    inputs: 1,
    outputs: 0,
    parameters: [
      { id: 'filename', name: 'اسم الملف', type: 'string', value: 'output.csv', required: true },
      { id: 'delimiter', name: 'الفاصل', type: 'select', value: ',', options: [
        { label: 'فاصلة', value: ',' },
        { label: 'فاصلة منقوطة', value: ';' },
        { label: 'Tab', value: '\t' },
      ]},
    ],
  },
];

export const nodeCategories = [
  { id: 'input', label: 'إدخال البيانات', icon: 'Database' },
  { id: 'processing', label: 'معالجة البيانات', icon: 'Cog' },
  { id: 'analysis', label: 'التحليل الإحصائي', icon: 'BarChart3' },
  { id: 'modeling', label: 'النمذجة', icon: 'Brain' },
  { id: 'timeseries', label: 'السلاسل الزمنية', icon: 'Activity' },
  { id: 'output', label: 'الإخراج والتصور', icon: 'Eye' },
] as const;

export function getNodesByCategory(category: string): NodeDefinition[] {
  return nodeDefinitions.filter(node => node.category === category);
}

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  return nodeDefinitions.find(node => node.type === type);
}
