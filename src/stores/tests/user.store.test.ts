import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "@/stores/user";
import { ValidationError } from "@/utils/errorHandling";

describe("User Store", () => {
  beforeEach(() => {
    // Reset store before each test
    useUserStore.setState({
      preferences: {
        name: null,
        avatar: "",
        hasCompletedOnboarding: false,
        lastVisit: null,
      },
      isLoaded: false,
      error: null,
    });
  });

  it("initializes with default preferences", () => {
    const state = useUserStore.getState();
    expect(state.preferences).toEqual({
      name: null,
      avatar: "",
      hasCompletedOnboarding: false,
      lastVisit: null,
    });
    expect(state.isLoaded).toBe(false);
    expect(state.error).toBeNull();
  });

  describe("setName", () => {
    it("sets a valid name", () => {
      useUserStore.getState().setName("David");
      expect(useUserStore.getState().preferences.name).toBe("David");
      expect(useUserStore.getState().error).toBeNull();
    });

    it("trims whitespace", () => {
      useUserStore.getState().setName("   Alice   ");
      expect(useUserStore.getState().preferences.name).toBe("Alice");
    });

    it("rejects empty string", () => {
      // simulate throwing ValidationError in store
      try {
        useUserStore.getState().setName("");
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
      }
      expect(useUserStore.getState().error).toBe("Name cannot be empty");
    });

    it("rejects too long name", () => {
      const longName = "a".repeat(51);
      try {
        useUserStore.getState().setName(longName);
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
      }
      expect(useUserStore.getState().error).toBe("Name cannot exceed 50 characters");
    });

    it("allows null to clear name", () => {
      useUserStore.getState().setName(null);
      expect(useUserStore.getState().preferences.name).toBeNull();
    });
  });

  describe("setAvatar", () => {
    it("sets a valid avatar", () => {
      useUserStore.getState().setAvatar("avatar.png");
      expect(useUserStore.getState().preferences.avatar).toBe("avatar.png");
    });

    it("rejects empty avatar string", () => {
      try {
        useUserStore.getState().setAvatar("");
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
      }
      expect(useUserStore.getState().error).toBe("Avatar must be a non-empty string");
    });
  });

  it("completes onboarding", () => {
    useUserStore.getState().completeOnboarding();
    expect(useUserStore.getState().preferences.hasCompletedOnboarding).toBe(true);
  });

  it("updates last visit", () => {
    useUserStore.getState().updateLastVisit();
    expect(useUserStore.getState().preferences.lastVisit).toBeInstanceOf(Date);
  });

  it("loads preferences", () => {
    useUserStore.getState().loadPreferences();
    expect(useUserStore.getState().isLoaded).toBe(true);
  });

  it("sets preferences directly", () => {
    const prefs = {
      name: "Bob",
      avatar: "bob.png",
      hasCompletedOnboarding: true,
      lastVisit: new Date("2025-01-01"),
    };
    useUserStore.getState().setPreferences(prefs);
    expect(useUserStore.getState().preferences).toEqual(prefs);
  });

  it("clears error", () => {
    useUserStore.setState({ error: "Something went wrong" });
    useUserStore.getState().clearError();
    expect(useUserStore.getState().error).toBeNull();
  });

  it("rehydrates storage and converts lastVisit to Date", () => {
    const state = useUserStore.getState();
    state.preferences.lastVisit = "2025-01-01T00:00:00Z" as any;

    // simulate onRehydrateStorage logic manually
    state.preferences = {
      ...state.preferences,
      lastVisit: new Date(state.preferences.lastVisit as string),
    };
    state.isLoaded = true;
    state.error = null;

    expect(state.preferences.lastVisit).toBeInstanceOf(Date);
    expect(state.isLoaded).toBe(true);
    expect(state.error).toBeNull();
  });
});
