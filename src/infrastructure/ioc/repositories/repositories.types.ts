const REPOSITORY_TYPES = {
  DebugRepository: Symbol.for("DebugRepository"),
  AnimalRepository: Symbol.for("AnimalRepository"),
  AdoptionRequestRepository: Symbol.for("AdoptionRequestRepository"),
  EventRepository: Symbol.for("EventRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  PublicImageStorage: Symbol.for("PublicImageStorage"),
  AdoptionRequestRepository: Symbol.for("AdoptionRequestRepository"),
  PrivateFileStorage: Symbol.for("PrivateFileStorage"),
  CartRepository: Symbol.for("CartRepository"),
  AuthRepository: Symbol.for("AuthRepository"),
  FoundationRepository: Symbol.for("FoundationRepository"),
  FoundationProfileRepository: Symbol.for("FoundationProfileRepository"),
  FoundationMembershipRepository: Symbol.for("FoundationMembershipRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  UserProfileRepository: Symbol.for("UserProfileRepository"),
};

export { REPOSITORY_TYPES };
