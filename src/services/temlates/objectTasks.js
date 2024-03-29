const PROJECT_DOCUMENTATION = [
  { name: 'Пояснительная записка' },
  { name: 'Схема планировочной организации земельного участка' },
  { name: 'Архитектурные решения' },
  { name: 'Конструктивные и объемно-планировочные решения' },
  {
    name: `Cведения об инженерном оборудовании, о сетях инженерно-технического обеспечения,
    перечень инженерно-технических  мероприятий содержание технологических решений`,
  },
  { name: 'Проект организации строительства' },
  { name: 'Проект организации работ по сносу или демонтажу объектов капитального строительства' },
  { name: 'Перечень мероприятий по охране окружающей среды' },
  { name: 'Мероприятия по обеспечению пожарной безопасности' },
  { name: 'Мероприятия по обеспечению доступа инвалидов' },
  {
    name: `Мероприятия по обеспечению соблюдения требований энергетической эффективности и требований оснащенности зданий,
      строений  сооружений приборами учета используемых энергетических ресурсов`,
  },
  { name: 'Смета на строительство объектов капитального строительства' },
  { name: 'Иная документация в случаях, предусмотренных федеральными законами' },
];

const allTasks = [{
  name: 'Концепция',
  tab: 'PREPROJECT',
}, {
  name: 'Гос контракт',
  tab: 'PREPROJECT',
  tasks: [{
    name: 'Техническое задание',
    statusType: 'TZ',
  }, {
    name: 'ОН (М) Ц',
    statusType: 'ONC',
  }, {
    name: 'Проект Гос. контракта',
    statusType: 'PROJECT_GK',
  }, {
    name: 'Казначейство',
    statusType: 'KAZNA',
  }],
}, {
  name: 'Сбор исходных данных (обследование)',
  tab: 'PROJECT',
}, {
  name: 'Изыскательские работы',
  tab: 'PROJECT',
  tasks: [{
    name: 'Геодезические изыскания',
  }, {
    name: 'Геологические изыскания',
  }, {
    name: 'Экологические изыскания',
  }, {
    name: 'Гидрометеорогические изыскания',
  }, {
    name: 'Специальные исследования и обследование земельного участка на предмет наличия взрывоопасных предметов',
  }],
}, {
  name: 'Проектная документация',
  tab: 'PROJECT',
  tasks: PROJECT_DOCUMENTATION,
}, {
  name: 'Гос. экспертиза',
  tab: 'PROJECT',
}, {
  name: 'История рабочей документации',
  tab: 'PROJECT',
}, {
  name: 'Торгово-закупочные процедуры',
  tab: 'SMR',
}, {
  name: 'Акты выполненных работ',
  tab: 'SMR',
}, {
  name: 'Процентовка',
  tab: 'SMR',
}, {
  name: 'КС - 2',
  tab: 'SMR',
}, {
  name: 'Допуск рабочих на объект строительства',
  tab: 'SMR',
}, {
  name: 'Строительство',
  tab: 'SMR',
}, {
  name: 'РНС (Разрешение на строительство)',
  tab: 'PASS',
}, {
  name: 'ЗОС',
  tab: 'PASS',
}, {
  name: 'РНВ',
  tab: 'PASS',
}, {
  name: 'Оформить право собственности РФ',
  tab: 'PASS',
}, {
  name: 'Итоговая проверка ГАСН',
  tab: 'PASS',
}, {
  name: 'Передать в эксплуатирующие организации',
  tab: 'PASS',
}];

module.exports = {
  allTasks,
  PROJECT_DOCUMENTATION,
};
