import { HiLocationMarker } from "react-icons/hi";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SearchBar = ({ filter = '', setFilter, onSearchClick }) => {
  const { t } = useTranslation("searchBar"); // Get t function directly

  return (
    <div className="flexCenter search-bar">
      <HiLocationMarker color="var(--blue)" size={25} />
      <input
        placeholder={t('searchBar.placeholder')}
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button className="button" onClick={onSearchClick}>{t('searchBar.search_button')}</button>
    </div>
  );
};

SearchBar.propTypes = {
  filter: PropTypes.string,
  setFilter: PropTypes.func,
  onSearchClick: PropTypes.func,
};

export default SearchBar;
