import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export const LanguageSwitcher = observer(() => {
  const { t, i18n } = useTranslation();

  const handleSwitch = (lng: string) => {
    localStorage.setItem('lng', lng);
    i18n.changeLanguage(lng);
  };

  return (
    <Select onChange={handleSwitch} value={i18n.language} style={{ marginRight: '5px' }}>
      <Option value='ru'>{t('ru')}</Option>
      <Option value='en'>{t('en')}</Option>
    </Select>
  );
});
