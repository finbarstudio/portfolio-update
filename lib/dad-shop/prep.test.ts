import { describe, expect, test } from "bun:test";
import { prepApplies, prepOf } from "./prep";

describe("prepOf", () => {
  test("raw chicken is raw", () => {
    expect(prepOf("Sainsbury's British Chicken Breast Fillets 640g")).toBe("raw");
    expect(prepOf("Sainsbury's British Fresh Skinless & Boneless Chicken Breast Fillets 320g")).toBe("raw");
    expect(prepOf("Sainsbury's Uncooked Chicken Breast Fillets 1kg")).toBe("raw");
  });
  test("deli and ready-to-eat chicken is cooked", () => {
    expect(prepOf("Sainsbury's Roast British Chicken Breast sliced 360g (Ready to Eat)")).toBe("cooked");
    expect(prepOf("Birds Eye Original Chicken Chargrills 4 pack")).toBe("cooked");
    expect(prepOf("Stamford Street Co. Cooked Chicken Breast 360g")).toBe("cooked");
    expect(prepOf("Sainsbury's Chargrilled Chicken Breast Chunks 80g")).toBe("cooked");
    expect(prepOf("Sainsbury's Cajun British Chicken Grills Ready to Eat 180g")).toBe("cooked");
    expect(prepOf("Smoked Salmon Slices 120g")).toBe("cooked");
  });
  test("a marinade on something ready to eat is still cooked", () => {
    expect(prepOf("Sainsbury's Tikka Sliced British Chicken Breast 180g (Ready to Eat)")).toBe("cooked");
  });
  test("breaded is breaded", () => {
    expect(prepOf("Birds Eye Chicken Chargrills Salt & Chilli Breadcrumb Coating 2 pack")).toBe("breaded");
    expect(prepOf("Sainsbury's Chicken Kievs 2 pack")).toBe("breaded");
    expect(prepOf("Sainsbury's Chicken Goujons 270g")).toBe("breaded");
    expect(prepOf("Sainsbury's Chicken Nuggets 220g")).toBe("breaded");
  });
  test("marinated and flavoured are marinated", () => {
    expect(prepOf("Sainsbury's BBQ Chicken Breast Fillets 400g")).toBe("marinated");
    expect(prepOf("Sainsbury's Piri Piri Chicken Breast 350g")).toBe("marinated");
    expect(prepOf("Sainsbury's Tikka Chicken Breast Pieces 400g")).toBe("marinated");
    expect(prepOf("Sainsbury's Just Cook Butter Basted Chicken Breast Fillets 300g")).toBe("marinated");
    expect(prepOf("Sainsbury's Sizzler Chicken Breast 500g")).toBe("marinated");
    expect(prepOf("Sainsbury's Flavoured Chicken Thighs 600g")).toBe("marinated");
  });
});

describe("prepApplies", () => {
  test("only fresh and frozen meat and fish", () => {
    expect(prepApplies({ animal: "chicken", zone: "Meat & fish", department: "Chicken" })).toBe(true);
    expect(prepApplies({ animal: "chicken", zone: "Frozen", department: "Meat & poultry" })).toBe(true);
    expect(prepApplies({ animal: "chicken", zone: "Chilled food", department: "Ready meals" })).toBe(false);
    expect(prepApplies({ animal: null, zone: "Meat & fish", department: "Chicken" })).toBe(false);
  });
});
