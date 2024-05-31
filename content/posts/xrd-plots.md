---
title: "XRD Plots with LaTeX"
date: 2024-5-31T14:00:00+01:00
draft: false
toc: false
images:
tags:
  - latex
  - plotting
  - pgfplots
  - tikz
  - diffraction
  - x-ray
---

This post contains an outline for how to generate LaTeX figures showing the results of X-Ray diffraction. The produced figures are styled like GSAS-II plots.

![Final plot](/static/xrd-plots/final-plot.png)

Note that XRD data sets are normally quite large, teetering on the edge of what LaTeX is able to handle. Definitely well over what LaTeX can comfortably handle and, as such, compilation times here are quite long - of the order of 6 minutes on my system.

In order to allow compilation to even occur, we must enable shell escape (look this up for your editor) and may have to use a non-standard LaTeX compiler such as LuaTeX instead of the standard pdfTeX.

## Data Formatting

One data file contains the data for the two-theta series.

![Header for two-theta series data.](/static/xrd-plots/data-two-theta.png)

And another data file contains the positions of the simulated peaks. The `peaktickval` column corresponds with the height of the peak on the main plot. There is most definitely a more sensible way to

![Header for peak position data.](/static/xrd-plots/data-peaks.png)


## LaTeX Code

```tex
%%%
% MUST ENABLE SHELL ESCAPE!
% Extension: LaTeX Workshop -> Settings -> Latex: Tools -> Edit in settings.json ->
% Add line:                 "-shell-escape",
%%%

% full compilation time: approx 6 minutes

\documentclass[border=0pt]{standalone}


\usepackage{tikz}
\usepackage{pgfplots}
\usepackage{pgfplotstable}
\pgfplotsset{compat=newest}
\usepgfplotslibrary{groupplots}
\pgfplotsset{filter discard warning=false, set layers, mark layer=axis tick labels}

\begin{document}

\pgfplotstableread[
  col sep=comma,
]{graph-data-mod.csv}{\data}

\pgfplotstableread[
  col sep=comma,
]{peak-pos.csv}{\peakpos}

\begin{tikzpicture}
  \begin{groupplot}[
    group style={
      group size=1 by 2,
      x descriptions at=edge bottom,
      vertical sep=0pt,
    },
    width=14cm,
    xmin=9, xmax=55,
  ]
  \nextgroupplot[
    height=6cm,
    % width=14cm,
    ylabel=Intensity (a.u.),
  ]
    \addplot[mark=none, red] table [
      x={x},
      % y={calc},
      y expr=\thisrow{calc}/2000,
    ] {\data};

    \addplot[only marks, mark=square*, mark size=1pt] table [
      x={x},
      % each nth point=3,
      y expr=\thisrow{obs}/2000,
    ] {\data};

    \addplot[only marks, mark=|, mark size=2pt] table [
      x={peakpos},
      y={peaktickval},
      y expr=\thisrow{peaktickval}/2000,
    ] {\peakpos};

    \legend{Fit, Obs, Peaks}

    \nextgroupplot[
      height=3cm,
      xlabel=$2\theta$,
      ylabel=$\Delta/\sigma$,
    ]
    \addplot[mark=none,] table [
      x={x},
      y={diffsigma},
  ] {\data};

  \end{groupplot}


  % \end{axis}
\end{tikzpicture}


\end{document}
```