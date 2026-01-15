const REPOSITORY_TYPES = {
  DebugRepository: Symbol.for("DebugRepository"),
  AnimalRepository: Symbol.for("AnimalRepository"),
  EventRepository: Symbol.for("EventRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  AdoptionRequestRepository: Symbol.for("AdoptionRequestRepository"),
  AuthRepository: Symbol.for("AuthRepository"),
  FoundationRepository: Symbol.for("FoundationRepository"),
  FoundationProfileRepository: Symbol.for("FoundationProfileRepository"),
  FoundationMembershipRepository: Symbol.for("FoundationMembershipRepository"),
};

export { REPOSITORY_TYPES };
