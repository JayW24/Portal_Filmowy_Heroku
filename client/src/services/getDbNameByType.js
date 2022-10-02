function getDbNameByType(type) {
    switch (type) {
      case 'Film':
        return 'film';
      case 'Series':
        return 'serial';
      case 'Premiere':
          return 'premiera';
      case 'Actor':
        return 'aktor';
      default:  return 'filmy'
    }
  }

  export default getDbNameByType;