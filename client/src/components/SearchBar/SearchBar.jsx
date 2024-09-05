import { HiLocationMarker } from "react-icons/hi";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ filter = '', setFilter, onSearchClick }) => {
  const { t } = useTranslation("searchBar");

  return (
    <div className="flexCenter search-bar">
      <HiLocationMarker color="var(--blue)" size={25} />
      <input
        placeholder={t('searchBar.placeholder')}
        type="text"
        value={filter} // Ensure the value is linked to the filter state
        onChange={(e) => setFilter(e.target.value)} // Update the filter state when the input changes
      />
      <button className="button" onClick={onSearchClick}>{t('searchBar.search_button')}</button>
    </div>
  );
};

SearchBar.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  onSearchClick: PropTypes.func,
};

export default SearchBar;
