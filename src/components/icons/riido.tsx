import type { SVGProps } from 'react';
/**
 * 디자이너 riido 아이콘 (src/assets/icons/riido/*.svg) — Figma feature-card 뱃지 40×40.
 * 배경(rect)은 뺐고 stroke를 currentColor로 바꿔 라이트/다크 토큰(primary-soft / primary-border)을 CSS로 준다.
 */
type Props = SVGProps<SVGSVGElement>;

export function RiidoChatIcon(props: Props) {
  return (
    <svg width="24" height="24" viewBox="8 8 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M11.0862 25.5092C11.172 25.1195 11.1392 24.7131 10.9922 24.3422C9.96895 22.2191 9.72843 19.8029 10.3131 17.5198C10.8977 15.2367 12.2699 13.2335 14.1876 11.8635C16.1053 10.4936 18.4452 9.84494 20.7946 10.0321C23.1439 10.2192 25.3516 11.2301 27.0282 12.8864C28.7049 14.5427 29.7427 16.7379 29.9585 19.0847C30.1743 21.4316 29.5543 23.7793 28.2079 25.7136C26.8614 27.6478 24.8751 29.0444 22.5993 29.6569C20.3235 30.2694 17.9046 30.0584 15.7692 29.0612C15.4187 28.9281 15.0379 28.8962 14.6702 28.9692L11.2572 29.9672C11.0925 30.0109 10.9195 30.0118 10.7544 29.9698C10.5893 29.9279 10.4377 29.8444 10.3138 29.7275C10.19 29.6105 10.0982 29.4638 10.047 29.3013C9.99574 29.1389 9.98686 28.966 10.0212 28.7992L11.0862 25.5092Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 20H16.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20H20.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 20H24.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RiidoAiSearchIcon(props: Props) {
  return (
    <svg width="24" height="24" viewBox="8 8 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M18.7 28.0001H12C11.4696 28.0001 10.9609 27.7894 10.5858 27.4143C10.2107 27.0392 10 26.5305 10 26.0001V13.0001C10 12.4697 10.2107 11.961 10.5858 11.5859C10.9609 11.2108 11.4696 11.0001 12 11.0001H15.9C16.2345 10.9968 16.5645 11.0775 16.8597 11.2347C17.1549 11.3919 17.406 11.6207 17.59 11.9001L18.4 13.1001C18.5821 13.3766 18.83 13.6036 19.1215 13.7607C19.413 13.9178 19.7389 14 20.07 14.0001H28C28.5304 14.0001 29.0391 14.2108 29.4142 14.5859C29.7893 14.961 30 15.4697 30 16.0001V20.1001"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.0001 29.0001L27.1001 27.1001"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 28C26.6569 28 28 26.6569 28 25C28 23.3431 26.6569 22 25 22C23.3431 22 22 23.3431 22 25C22 26.6569 23.3431 28 25 28Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RiidoArrangeIcon(props: Props) {
  return (
    <svg width="24" height="24" viewBox="8 8 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M18.5861 13.4141L13.4141 18.5861"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.5861 21.4141L21.4141 26.5861"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 20H26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 30C21.1046 30 22 29.1046 22 28C22 26.8954 21.1046 26 20 26C18.8954 26 18 26.8954 18 28C18 29.1046 18.8954 30 20 30Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 22C29.1046 22 30 21.1046 30 20C30 18.8954 29.1046 18 28 18C26.8954 18 26 18.8954 26 20C26 21.1046 26.8954 22 28 22Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RiidoVisionIcon(props: Props) {
  return (
    <svg width="24" height="24" viewBox="8 8 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M20.83 10.1799C20.5694 10.061 20.2864 9.99951 20 9.99951C19.7136 9.99951 19.4305 10.061 19.17 10.1799L10.6 14.0799C10.4225 14.1581 10.2716 14.2863 10.1657 14.4487C10.0598 14.6112 10.0034 14.8009 10.0034 14.9949C10.0034 15.1888 10.0598 15.3786 10.1657 15.541C10.2716 15.7035 10.4225 15.8316 10.6 15.9099L19.18 19.8199C19.4405 19.9387 19.7236 20.0002 20.01 20.0002C20.2964 20.0002 20.5794 19.9387 20.84 19.8199L29.42 15.9199C29.5974 15.8416 29.7483 15.7135 29.8542 15.551C29.9601 15.3886 30.0165 15.1988 30.0165 15.0049C30.0165 14.8109 29.9601 14.6212 29.8542 14.4587C29.7483 14.2963 29.5974 14.1681 29.42 14.0899L20.83 10.1799Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20C9.99953 20.1913 10.0539 20.3787 10.1567 20.5399C10.2595 20.7012 10.4064 20.8297 10.58 20.91L19.18 24.82C19.4392 24.9374 19.7205 24.9981 20.005 24.9981C20.2895 24.9981 20.5708 24.9374 20.83 24.82L29.41 20.92C29.587 20.8404 29.737 20.7111 29.8418 20.5477C29.9466 20.3844 30.0015 20.1941 30 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 25C9.99953 25.1913 10.0539 25.3787 10.1567 25.5399C10.2595 25.7012 10.4064 25.8297 10.58 25.91L19.18 29.82C19.4392 29.9374 19.7205 29.9981 20.005 29.9981C20.2895 29.9981 20.5708 29.9374 20.83 29.82L29.41 25.92C29.587 25.8404 29.737 25.7111 29.8418 25.5477C29.9466 25.3844 30.0015 25.1941 30 25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
