/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

const createAvatarImage = (name) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D9ECA2" />
          <stop offset="100%" stop-color="#7D9C6D" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#avatarGradient)" />
      <circle cx="80" cy="80" r="70" fill="rgba(255,255,255,0.18)" />
      <text x="80" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#ffffff" font-weight="700">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const initialProfile = {
  name: "Faiz Developer",
  avatarImage: createAvatarImage("Faiz Developer"),
  xp: 920,
  gems: 125,
  streakDays: 30,
  completedChallenges: 1,
  stats: {
    activitiesCompleted: 3,
    dietPlansFollowed: 1,
    challengeMilestonesCompleted: 2,
  },
  rewardedActions: {},
};

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(initialProfile);

  const awardProgress = ({ actionKey, xp = 0, gems = 0, updates = {} }) => {
    if (!actionKey) {
      return false;
    }

    let didAward = false;

    setUserProfile((previous) => {
      if (previous.rewardedActions[actionKey]) {
        return previous;
      }

      didAward = true;

      return {
        ...previous,
        xp: previous.xp + xp,
        gems: previous.gems + gems,
        completedChallenges:
          previous.completedChallenges + (updates.completedChallenges ?? 0),
        stats: {
          ...previous.stats,
          activitiesCompleted:
            previous.stats.activitiesCompleted +
            (updates.activitiesCompleted ?? 0),
          dietPlansFollowed:
            previous.stats.dietPlansFollowed + (updates.dietPlansFollowed ?? 0),
          challengeMilestonesCompleted:
            previous.stats.challengeMilestonesCompleted +
            (updates.challengeMilestonesCompleted ?? 0),
        },
        rewardedActions: {
          ...previous.rewardedActions,
          [actionKey]: true,
        },
      };
    });

    return didAward;
  };

  const gamification = {
    userProfile,
    currentLevel: Math.floor(userProfile.xp / 250) + 1,
    certificates: [
      {
        id: "thirty-day-sober",
        title: "30 Days Sober Challenge",
        subtitle: "Certificate of Recognition",
        requiredXp: 1000,
        requiredStreak: 30,
        awardedXp: 1000,
        unlocked: userProfile.xp >= 1000 && userProfile.streakDays >= 30,
      },
    ],
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        gamification,
        awardProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
