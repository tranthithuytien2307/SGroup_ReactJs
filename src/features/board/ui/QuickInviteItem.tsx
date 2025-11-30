// import React from "react";

// interface QuickInviteItemProps {
//   name: string;
//   email: string;
//   avatar?: string;
//   onInvite: () => void;
// }

// export const QuickInviteItem: React.FC<QuickInviteItemProps> = ({
//   name,
//   email,
//   avatar,
//   onInvite,
// }) => {
//   return (
//     <div className="flex items-center justify-between p-2 border rounded mb-2">
//       <div className="flex items-center gap-2 cursor-pointer">
//         {avatar ? (
//           <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
//         ) : (
//           <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
//             {name.charAt(0)}
//           </div>
//         )}
//         <div>
//           <div className="font-medium">{name}</div>
//           <div className="text-sm text-gray-500">{email}</div>
//         </div>
//       </div>

//       <button
//         onClick={onInvite}
//         className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
//       >
//         Invite
//       </button>
//     </div>
//   );
// };

import React from "react";

interface QuickInviteItemProps {
  name: string;
  email: string;
  avatar?: string;
  onInvite: () => void;
}

export const QuickInviteItem: React.FC<QuickInviteItemProps> = ({
  name,
  email,
  avatar,
  onInvite,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition mt-2">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-base font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <div className="font-medium">{name}</div>
          <div className="text-gray-500 text-sm">{email}</div>
        </div>
      </div>

      <button
        onClick={onInvite}
        className="px-4 py-[6px] border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer text-sm"
      >
        Mời
      </button>
    </div>
  );
};
