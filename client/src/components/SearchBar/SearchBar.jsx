import { HiLocationMarker } from "react-icons/hi";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ filter = '', setFilter }) => {
  const { t } = useTranslation("searchBar");

  return (
    <div className="flexCenter search-bar">
      <HiLocationMarker color="var(--blue)" size={25} />
      <input
        placeholder={t('searchBar.search_placeholder')}
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button className="button">{t('searchBar.search_button')}</button>
    </div>
  );
};

SearchBar.propTypes = {
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};

export default SearchBar;
