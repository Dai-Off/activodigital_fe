import moment from 'moment'


export const formatofechaCorta = (isoString: string) => {
    if (!isoString) return "";
    return moment(isoString).format('YYYY-MM-DD HH:mm:ss')
  };