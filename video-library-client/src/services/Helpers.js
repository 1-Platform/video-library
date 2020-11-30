/**
 * A simplified fetch wrapper for GraphQL queries and mutations
 * @param {{query: string, variables: object}} body
 */
const fetchClient = (body) => {
  return fetch(`${process.env.REACT_APP_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.errors) {
        throw res.errors;
      }
      return res.data;
    });
};
/**
 * Rounds off view count (eg. 1K, 1M, etc)
 */
const roundOffViews = (totalViews) => {
  const suffixes = ["k", "M", "B"];

  if (isNaN(totalViews)) {
    return null;
  }
  if (totalViews < 1000) {
    return totalViews;
  }

  let exp = Math.floor(Math.log(totalViews) / Math.log(1000));

  if (exp > suffixes.length) {
    exp = suffixes.length;
  }

  /* MAGIC: Do not remove the + at the start, it removes the trailing .00 for while numbers */
  return +(totalViews / Math.pow(1000, exp)).toPrecision(2) + suffixes[exp - 1];
};
/**
 * Escapes the string for special characters
 */
const escapeString = (string) => {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};
/**
 * Filter videos on multiple properties passed on a search term
 */
const multiPropsFilter = (videos, searchProps, searchTerm) => {
  const regex = new RegExp(escapeString(searchTerm), "i");
  return videos.filter((video) => {
    return (
      regex.test(video["title"]) ||
      regex.test(video["description"]) ||
      regex.test(video["tags"].join(";")) ||
      !!video.createdBy && regex.test(video.createdBy["name"]) ||
      regex.test(video["source"])
    );
  });
};

const humanizeTime = (timeInSeconds) => {
  const isoString = new Date(timeInSeconds * 1000).toISOString();
  const [, h, m, s] = isoString.split(/^PT(\d+H)?(\d+M)?(\d+S)?$/);

  return `${h ? h.slice(0, -1) + ":" : ""}${m ? m.slice(0, -1) + ":" : "00:"}${
    s ? s.slice(0, -1) : "00"
  }`;
};

const getSourceIcon = (source) => {
  return source === "drive"
    ? "logo-google"
    : source === "youtube"
    ? "logo-youtube"
    : "open-outline";
};

const formatDate = (date) => {
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  return date === null ? "N/A" : `${da}-${mo}-${ye}`;
};

export default {
  fetchClient,
  roundOffViews,
  humanizeTime,
  multiPropsFilter,
  getSourceIcon,
  formatDate,
};
