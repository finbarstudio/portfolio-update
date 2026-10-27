import { describe, expect, test } from "bun:test";
import { packInfo, parseCount, parseMultipack, parseSize, sizeText } from "./pack";

const base = { packGrams: null, unitMeasure: "kg", price: 3, unitPrice: null };

describe("pack size", () => {
  test("formats grams, kilos, millilitres and litres", () => {
    expect(sizeText(400, "g")).toBe("400g");
    expect(sizeText(1000, "g")).toBe("1kg");
    expect(sizeText(1250, "g")).toBe("1.25kg");
    expect(sizeText(750, "ml")).toBe("750ml");
    expect(sizeText(2000, "ml")).toBe("2L");
    expect(sizeText(1500, "ml")).toBe("1.5L");
  });

  test("reads sizes out of names", () => {
    expect(parseSize("Sainsbury's Chicken Legs 510g")?.text).toBe("510g");
    expect(parseSize("Cola 2L")?.text).toBe("2L");
    expect(parseSize("Milk 1 litre")?.text).toBe("1L");
    expect(parseSize("Flour 1.5kg")?.text).toBe("1.5kg");
    expect(parseSize("Tabasco 256ml")?.text).toBe("256ml");
    expect(parseSize("Nestle Shredded Wheat x30 675g")?.text).toBe("675g");
    expect(parseSize("Weetabix 24 Original Cereal Pack")).toBeNull();
  });

  test("a protein or fat claim in the name is not the pack size", () => {
    expect(parseSize("Quest 20g Protein Chips 32g")?.text).toBe("32g");
    expect(parseSize("High Protein Bar 20g protein")).toBeNull();
  });

  test("reads multipacks", () => {
    expect(parseMultipack("Diet Coke 4 x 250ml Glass Bottles")).toEqual({ text: "4 x 250ml", base: 1000, unit: "ml" });
    expect(parseMultipack("Peperami Minis 10x10g")?.text).toBe("10 x 10g");
    expect(parseMultipack("Fridge Raiders 6 x 45g Bags")).toEqual({ text: "6 x 45g", base: 270, unit: "g" });
    expect(parseMultipack("Cans 24 x 0.33L")?.text).toBe("24 x 330ml");
    expect(parseMultipack("Chicken 510g")).toBeNull();
  });

  test("reads counts", () => {
    expect(parseCount("Sainsbury's Free Range British Eggs Medium x15")).toBe(15);
    expect(parseCount("Warburtons 6 x Our Dough Crumpets")).toBe(6);
    expect(parseCount("Twinings Fruit Tea, 20 Tea Bags")).toBe(20);
    expect(parseCount("Pack of 4 Rolls")).toBe(4);
    expect(parseCount("Green Pepper")).toBeNull();
    expect(parseCount("Vitamin B6 Tablets")).toBeNull();
  });

  test("a multipack in the name beats the total in the database", () => {
    const p = packInfo({ ...base, name: "Pepsi 8 x 330ml Max Tropical Cans", packGrams: 2640, unitMeasure: "ltr" });
    expect(p).toEqual({ text: "8 x 330ml", estimated: false });
  });

  test("the database weight is used when there is one", () => {
    expect(packInfo({ ...base, name: "Peri Peri Chicken Legs", packGrams: 510 })?.text).toBe("510g");
    expect(packInfo({ ...base, name: "J2O Fizz", packGrams: 750, unitMeasure: "ltr" })?.text).toBe("750ml");
    expect(packInfo({ ...base, name: "Itsu Broth", packGrams: 1000, unitMeasure: "ltr" })?.text).toBe("1L");
  });

  test("falls back to the name, then a count, then an estimate", () => {
    expect(packInfo({ ...base, name: "Cheddar 400g" })).toEqual({ text: "400g", estimated: false });
    expect(packInfo({ ...base, name: "Jazz Apples x6", unitMeasure: "ea" })).toEqual({ text: "6 pack", estimated: false });
    expect(packInfo({ ...base, name: "Rice Vermicelli Noodles", price: 1.5, unitPrice: 3 })).toEqual({ text: "≈500g", estimated: true });
    expect(packInfo({ ...base, name: "Cola", unitMeasure: "ltr", price: 1.5, unitPrice: 1 })).toEqual({ text: "≈1.5L", estimated: true });
  });

  test("nothing to go on gives nothing, never a guess", () => {
    expect(packInfo({ ...base, name: "Green Pepper", unitMeasure: "ea", unitPrice: 0.5 })).toBeNull();
    expect(packInfo({ ...base, name: "Bouquet", unitMeasure: null })).toBeNull();
  });
});
