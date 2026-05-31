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
    <section className="testimonial" aria-label="Client testimonial">
      <div className="testimonial-inner">
        <span className="testimonial-mark" aria-hidden="true">&ldquo;</span>
        <blockquote className="testimonial-quote">{quote}</blockquote>
        <cite className="testimonial-author">— {author}</cite>
      </div>
    </section>
  );
}
