/**
 * Testimonial — a large pull-quote block placed prominently on a case study.
 * Soft pink wash, oversized opening quote mark, author attribution in mono caps.
 */
export default function Testimonial({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <section className="testimonial -mx-5 md:-mx-10" aria-label="Client testimonial">
      <div className="testimonial-inner">
        <blockquote className="testimonial-quote">{quote}</blockquote>
        <cite className="testimonial-author">{author}</cite>
      </div>
    </section>
  );
}
